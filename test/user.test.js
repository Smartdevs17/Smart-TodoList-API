const expect = require("expect").expect;
const request = require("supertest");
const {ObjectId} = require("mongodb");
const app = require("../app");

const Todo = require("../models/Todo");
const User = require("../models/User");
const {populateTodo,populateUser,users,tasks} = require("./data/data");

beforeEach(populateUser);

describe("GET /api/users/me",() => {
    it("should get a user using token",(done) => {
        let user = users[0];
        request(app)
        .get("/api/users/me")
        .set("x-auth",user.tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.message._id).toBe(user._id.toHexString());
            expect(res.body.message.email).toBe(user.email);
        })
        .end(done)
    });

    it("should return a 401 if user token is not authenticated",(done) => {

        request(app)
        .get("/api/users/me")
        .expect(401)
        .expect((res) => {
            expect(res.body.success).toBe(false);
        })
        .end(done)
    });
});

describe("POST /api/users/new_user",() => {
    it("should create a new user",(done) => {
        const user1 = {
            email: "newuser1@gmail.com",
            password: "testpassword"
        }

        request(app)
        .post("/api/users/new_user")
        .send(user1)
        .expect((res) => {
            expect(res.header["x-auth"]).not.toBeNull()
            expect(res.body.success).toBe(true);
            expect(res.body.message._id).not.toBeNull();
            expect(res.body.message.email).toBe(user1.email)
        })
        .end((err) => {
            if(err) return done(err);

            User.findOne({email: user1.email}).then((user) => {
                expect(user).not.toBeNull();
                expect(user.password).not.toBe(user1.password)
            });
            done();
        })
    });

    it("should return validation error for invalid request",(done) => {
        request(app)
        .post("/api/users/new_user")
        .send({
            email: "testuser",
            password: "testpassword"
        })
        .expect(400)
        .end(done)
    });

    it("should return error if email is in use",(done) => {
        request(app)
        .post("/api/users/new_user")
        .send({
            email: users[2].email,
            password: "testpassword"
        })
        .expect(400)
        .end(done)
    });
});
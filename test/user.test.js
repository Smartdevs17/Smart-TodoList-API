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
            // expect(res.body.message._id).toBe(user._id.toHexString());
            // expect(res.body.message.email).toBe(user.email);
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

describe("POST /api/users/login",() => {
    it("should login user and return auth token",(done) => {

        request(app)
        .post("/api/users/login")
        .send({
            email: users[0].email,
            password: users[0].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers["x-auth"]).not.toBeNull();
        })
        .end((err,res) => {
            if(err) return done(err)

            User.findById(users[0]._id).then((user) => {
                expect(user.tokens[0]).toHaveProperty("access","Auth")
                expect(user.tokens[0]).toHaveProperty("token",res.headers["x-auth"])

                done()
            }).catch((err) =>  done(err))
        });
    });

    it("should reject invalid logins credentials",(done) => {
        request(app)
        .post("/api/users/login")
        .send({
            email: users[2].email,
            password: users[2].password+ "3"
        })
        .expect(404)
        .expect((res) => {
            expect(res.headers["x-auth"]).toBeUndefined();
        })
        .end((err,res) => {
            if(err) return done(err)

            User.findById(users[2]._id).then((user) => {
                expect(user.tokens.length).toBe(0)
                done()
            }).catch((err) =>  done(err))
        });
    });
});

describe("DELETE /api/users/delete/token",() => {
    it("should delete a user token on logout",(done) => {
        let user = users[0];
        request(app)
        .delete("/api/users/delete/token")
        .set("x-auth",user.tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
        })
        .end((err,res) => {
            if(err) return done(err);

            User.findById(user._id).then((user) => {
                expect(user.tokens.length).toBe(0);

                done()
            }).catch((err) => done(err))
            
        })
    });
})
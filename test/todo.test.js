const expect = require("expect").expect;
const request = require("supertest");
const {ObjectId} = require("mongodb");
const app = require("../app");

const Todo = require("../models/Todo");
const {populateTodo,populateUser,users,tasks} = require("./data/data");

beforeEach(populateTodo);
beforeEach(populateUser);

describe("POST /api/todos/add_task",() => {
    it("should create a new task",(done) => {
        let newtask = {
            task: "I am testing the add task route",
            userId: users[0]._id
        }
        request(app)
        .post("/api/todos/add_task")
        .set("x-auth",users[0].tokens[0].token)
        .send(newtask)
        .expect(201)
        .expect((res) => {
            expect(res.body.success).toBe(true)
            expect(res.body.message.task).toBe(newtask.task)
        })
        .end((err,res) => {
            if(err) return done(err);

            Todo.find({task: newtask.task}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].task).toBe(newtask.task);
                done();
            }).catch((err) => {
                done(err)
            });
        });
    });


    it("should not create a todo with invalid body data",(done) => {
        
        request(app)
        .post("/api/todos/add_task")
        .send({})
        .expect(401)
        .end((err,res) => {
            if(err) return done(err);

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((err) => {
                done(err);
            })
        })
    })
});


describe("GET /api/todos/all_tasks",() => {
    it("should get all the tasks",(done) => {
        request(app)
        .get("/api/todos/all_tasks")
        .set("x-auth",users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.message.length).toBe(1);
        })
        .end(done)
    });
});

describe("GET /api/todos/:id",() => {
    it("should get a task",(done) => {
        request(app)
        .get(`/api/todos/${tasks[0]._id.toHexString()}`)
        .set("x-auth",users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.message.task).toBe(tasks[0].task);
        })
        .end(done)
    });


    it("should not return a task of another user",(done) => {
        request(app)
        .get(`/api/todos/${tasks[1]._id.toHexString()}`)
        .set("x-auth",users[0].tokens[0].token)
        .expect(404)
        .end(done)
    });

    it("should return 404 not found for an id",(done) => {
        let hexId = new ObjectId().toHexString();
        request(app)
        .get(`/api/todos/${hexId}`)
        .set("x-auth",users[0].tokens[0].token)
        .expect(404)
        .end(done)
    });

    it("should return 400 bad request for non-objectId",(done) => {
        let hexId = new ObjectId().toHexString();
        request(app)
        .get(`/api/todos/113abc`)
        .set("x-auth",users[0].tokens[0].token)
        .expect(400)
        .end(done)
    });
});

describe("DELETE /api/todos/delete_task/:id",() => {
    it("should delete a task",(done) => {
        let id = tasks[0]._id.toHexString();
        request(app)
        .delete(`/api/todos/delete_task/${id}`)
        .set("x-auth",users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
           
        })
        .end((err,res) => {
            if(err) return done(err);

            Todo.findById(id).then((todo) => {
                expect(todo).toBeNull();
                done();
            }).catch((err) => {
                done(err);
            })
        });
    });

    it("should not delete a task of a different user",(done) => {
        let id = tasks[1]._id.toHexString();
        request(app)
        .delete(`/api/todos/delete_task/${id}`)
        .set("x-auth",users[0].tokens[0].token)
        .expect(404)
        .expect((res) => {
            expect(res.body.success).toBe(false);
           
        })
        .end((err,res) => {
            if(err) return done(err);

            Todo.findById(id).then((todo) => {
                expect(todo).not.toBeNull();
                done();
            }).catch((err) => {
                done(err);
            })
        });
    });


    it("should return 400 if ObjectId is invalid",(done) => {
        request(app)
        .delete("/api/todos/delete_task/123")
        .set("x-auth",users[0].tokens[0].token)
        .expect(400)
        .end(done)
    });

    it("should return 404 if todo not found",(done) => {
        let id = new ObjectId().toHexString();
        request(app)
        .delete(`/api/todos/delete_task/${id}`)
        .set("x-auth",users[0].tokens[0].token)
        .expect(404)
        .end(done)
    });
});

describe("UPDATE /api/todos/update_task/:id",() => {
    it("should update the task",(done) => {
        let id = tasks[0]._id.toHexString();
        let updateTask = {
            task: "Wash all the cloth in the house",
            completed: true
        };

        request(app)
        .put(`/api/todos/update_task/${id}`)
        .set("x-auth",users[0].tokens[0].token)
        .send(updateTask)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.message.task).toBe(updateTask.task)
            expect(res.body.message.completed).toBe(true)
            expect(typeof(parseInt(res.body.message.completedAt))).toBe("number")
        })
        .end(done)
    });

    it("should not update the task if it does not belong to the user",(done) => {
        let id = tasks[0]._id.toHexString();
        let updateTask = {
            task: "Wash all the cloth in the house",
            completed: true
        };

        request(app)
        .put(`/api/todos/update_task/${id}`)
        .set("x-auth",users[1].tokens[0].token)
        .send(updateTask)
        .expect(404)
        .expect((res) => {
            expect(res.body.success).toBe(false);
        })
        .end(done)
    });

    it("should clear completedAt if the task is not completed",(done) => {
        let id = tasks[0]._id.toHexString();
        let updateTask = {
            task: "mop the floor",
            completed: false
        };

        request(app)
        .put(`/api/todos/update_task/${id}`)
        .set("x-auth",users[0].tokens[0].token)
        .send(updateTask)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
            expect(res.body.message.task).toBe(updateTask.task)
            expect(res.body.message.completed).toBe(false)
            expect(typeof(parseInt(res.body.message.completedAt))).toBe("number")
        })
        .end(done)
    });
});
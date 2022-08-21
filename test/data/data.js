const {ObjectId} = require("mongodb");
const Todo = require("../../models/Todo");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");



const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const userThreeId = new ObjectId();


const tasks = [
    {
        _id: new ObjectId(),
        task: "Clean the house",
        userId: userOneId
    },
    {
        _id: new ObjectId(),
        task: "Go to buy kerosine",
        userId: userTwoId
    }
];

const users = [
    {
        _id: userOneId,
        email: "user1@gmail.com",
        password: "user1password",
        tokens: [
            {
                access: "Auth",
                token: jwt.sign({_id: userOneId,access: "Auth"},process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: "user2@gmail.com",
        password: "user2password",
        tokens: [
            {
                access: "Auth",
                token: jwt.sign({_id: userTwoId,access: "Auth"},process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id: userThreeId,
        email: "user3@gmail.com",
        password: "user3password",
    },
    
]

const populateTodo = (done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(tasks).then(() => done())
    })
};

const populateUser = (done) => {
    User.deleteMany({}).then(() => {
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();
        const userThree = new User(users[2]).save();

        return Promise.all([userOne,userTwo,userThree])
    }).then(() => done())
}

module.exports = {populateTodo,populateUser,users,tasks};
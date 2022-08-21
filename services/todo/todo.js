const Todo = require("../../models/Todo");

//Add a new Todo to DB
const AddTodo = (data) => {
 
        const newTodo = new Todo(data);
        return   newTodo.save().then((doc) => {
            return {success: true, message: doc}
        }).catch((err) => {
            return {success: false, message: err.message}
        })
};

// Fetch all todos
const FetchAllTodo = (id) => {
    return Todo.find({userId: id}).then((todos) => {
        return {success: true,message: todos}
    }).catch((err) => {
        return {success: false,message: err.message}
    })
};

//Fetch a specific todo
const FetchATodo = (id,userId) => {
    return Todo.findOne({_id: id,userId: userId}).then((todo) => {
        if(todo){
            return {success: true,message: todo};
        }else{
            return {success: false,message: "No todo found with that id"};
        }
    }).catch((err) => {
        return {success: false,message: err.message}
    })
};

//Remove a todo
const RemoveTodo = (id,userId) => {
    return Todo.findOneAndDelete({_id: id,userId: userId}).then((todo) => {
        if(todo){
            return {success: true, message: todo};
        }else{
            return {success: false, message: "No todo found with that id"};
        }
    }).catch((err) => {
        return {success: false,message: err.message};
    });
};

// Update a Todo
const PatchTodo = (id,userId,data) => {
    return Todo.findOneAndUpdate({_id: id,userId: userId},{$set: data},{new: true}).then((todo) => {
        if(todo){
            return {success: true, message: todo};
        }else{
            return {success: false, message: "No todo found with that id"}
        }
    }).catch((err) => {
        return {success: false, message: err.message};
    });
};








module.exports = {AddTodo,FetchAllTodo,FetchATodo,RemoveTodo,PatchTodo};
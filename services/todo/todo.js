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
const FetchAllTodo = () => {
    return Todo.find().then((todos) => {
        return {success: true,message: todos}
    }).catch((err) => {
        return {success: false,message: err.message}
    })
};

//Fetch a specific todo
const FetchATodo = (id) => {
    return Todo.findById(id).then((todo) => {
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
const RemoveTodo = (id) => {
    return Todo.findByIdAndDelete(id).then((todo) => {
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
const PatchTodo = (id,data) => {
    return Todo.findByIdAndUpdate(id,{$set: data},{new: true}).then((todo) => {
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
const {ObjectId} = require("mongodb");
const _ = require("lodash");
const {AddTodo, FetchAllTodo, FetchATodo, PatchTodo, RemoveTodo} = require("../../services/todo/todo");

// Add a new Todo 
const CreateTodo = async(req,res) => {
    try {
        const task = req.body.task;
        if(task){
            const values = req.body;
            const newTask = await AddTodo(values);
            // console.log(newTask);
            const {success, message} = newTask;
            if(success){
                res.status(201).json({
                    success,message
                })
            }else{
                res.status(400).json({
                    success,message,
                    error: "There seems to be an error while saving task to DB"
                })
            }
        }else{
            res.status(400).json({
                success: false,
                message: "task field is required"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "It seems like there is an issue with the server will be fix soon"
        });
    }
};

// Get all the todos
const GetAllTodo = async(req,res) => {
    try {
        const tasks = await FetchAllTodo();
        const {success, message} = tasks;
        if(success){
            res.status(200).json({
                success,message
            });
        }else{
            res.status(404).json({
                success,message,
                error: "There seems to be an error while saving task to DB"
            })
        }     
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "It seems like there is an issue with the server will be fix soon"
        }); 
    }
}

//Get a specific todo using the todo id
const GetATodo = async(req,res)=> {
    try {
        const id = req.params.id;
        if(ObjectId.isValid(id)){
            const todo = await FetchATodo(id);
            const {success, message} = todo;
            if(success){
                res.status(200).json({
                    success,message
                });
            }else{
                res.status(404).json({
                    success,message,
                    error: "There seems to be an error while fetching todo from DB"
                })
            }  
        }else{  
            res.status(400).json({
                success: false,
                error: "Bad request as a valid todo id is needed  for the search"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "It seems like there is an issue with the server will be fix soon"
        });    
    }
};

//Delete a todo using id
const UpdateTodo = async(req,res) => {
    try {
        const id = req.params.id;
        const values = _.pick(req.body,["task","completed"])
        if(ObjectId.isValid(id) ){
            if(_.isBoolean(values.completed) && values.completed){
                values.completedAt = new Date().getTime();
            }else{
                values.completed = false;
                values.completedAt = null;
            }
            const todo = await PatchTodo(id,values);
            const {success, message} = todo;
            if(success){
                res.status(200).json({
                    success,message
                });
            }else{
                res.status(404).json({
                    success,message,
                    error: "There seems to be an error while fetching todo from DB"
                })
            }  
        }else{  
            res.status(400).json({
                success: false,
                error: "Bad request as a valid todo id and task is needed  for the update"
            })
        } 
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "It seems like there is an issue with the server will be fix soon"
        });        
    }
}


//Get a specific todo using the todo id
const DeleteTodo = async(req,res)=> {
    try {
        const id = req.params.id;
        if(ObjectId.isValid(id)){
            const todo = await RemoveTodo(id);
            const {success, message} = todo;
            if(success){
                res.status(200).json({
                    success,message,result: "Successfully deleted Todo"
                });
            }else{
                res.status(404).json({
                    success,message,
                    error: "There seems to be an error while fetching todo from DB"
                })
            }  
        }else{  
            res.status(400).json({
                success: false,
                error: "Bad request as a valid todo id is needed  for the search"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "It seems like there is an issue with the server will be fix soon"
        });    
    }
};




module.exports = {CreateTodo,GetAllTodo,GetATodo,UpdateTodo,DeleteTodo};
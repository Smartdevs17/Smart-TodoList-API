const { CreateTodo, GetAllTodo, GetATodo, UpdateTodo, DeleteTodo } = require("../../controllers/todo/todo");
const authenticate = require("../../middleware/authenticate");
const router = require("express").Router();


router.post("/add_task",authenticate,CreateTodo);
router.get("/all_tasks",authenticate,GetAllTodo);
router.get("/:id",authenticate,GetATodo);
router.put("/update_task/:id",authenticate,UpdateTodo);
router.delete("/delete_task/:id",authenticate,DeleteTodo);







module.exports = router;
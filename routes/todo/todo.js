const { CreateTodo, GetAllTodo, GetATodo, UpdateTodo, DeleteTodo } = require("../../controllers/todo/todo");

const router = require("express").Router();


router.post("/add_task",CreateTodo);
router.get("/all_tasks",GetAllTodo);
router.get("/:id",GetATodo);
router.put("/update_task/:id",UpdateTodo);
router.delete("/delete_task/:id",DeleteTodo);







module.exports = router;
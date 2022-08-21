const router = require("express").Router();
const { RegisterUser, GetUser, LoginUser, DeleteToken } = require("../../controllers/user/user");
const authenticate = require("../../middleware/authenticate");



//Create New User
router.post("/new_user",RegisterUser);
router.get("/me",authenticate,GetUser);
router.post("/login",LoginUser)
router.delete("/delete/token",authenticate,DeleteToken)





module.exports = router;

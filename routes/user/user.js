const router = require("express").Router();
const { RegisterUser, GetUser } = require("../../controllers/user/user");
const authenticate = require("../../middleware/authenticate");



//Create New User
router.post("/new_user",RegisterUser);
router.get("/me",authenticate,GetUser);





module.exports = router;

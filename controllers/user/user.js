const {CreateUser,FetchUser} = require("../../services/user/user");
const _ = require("lodash")

const RegisterUser = async(req,res) => {
    try {
        const {email,password} = req.body;
        // const values = _.pick(req.body,["email","password"]);
        if(email && password){
            const values = {email,password}
            const newUser =  await CreateUser(values);
            const result = _.pick(newUser,["success","message","token"]);
            if(result.success){
                res.header("x-auth",result.token).status(201).json({
                   success:  result.success,
                    message: result.message
                })
            }else{
                res.status(400).json({
                    success: result.success,
                    message: result.message,
                    error: "There seems to be an error while trying to save data to database.."
                })
            }
        }else{
            res.status(400).json({
                error: "Bad request ",
                message: "Please input your username and password to signup"
            })
        }
    } catch (error) {
        res.status(500).json({
            error: error,
            message: "There seems to be a problem with the server the issues will be resolve soon"
        })
    }
};



const GetUser = async(req,res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(401).json(error.message)
    }
}

module.exports = {RegisterUser,GetUser}

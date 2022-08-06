const {FetchUser} = require("../services/user/user");


const authenticate = async(req,res,next) => {
    try {
        const token = req.header("x-auth");
        if(!token){
            res.status(401).json({
                success: false,
                message: "Please send a valid token"
            }); 
        }else{
            const user =  await FetchUser(token);
            const {success, message} = user;
            if(success){
                req.user = user;
                req.token = token;
                next();
            }else{
                res.status(403).json({
                    success: false,
                    message: "Please send a valid token"
                });
            }
        }

    } catch (error) {
        res.status(500).json(error.message)
    } 
}

module.exports = authenticate;
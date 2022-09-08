 const User = require("../../models/User");

 const CreateUser = (data) => {
    const newUser = new User(data);
    return newUser.save().then(() => {
        return newUser.generateAuthToken();
    }).then((token) => {
        return  {success: true,message: newUser,token};
    }).catch((err) => {
        return {success: false,message: err}
    });
 };

 const FetchUser = (data) => {
    return User.findByToken(data).then((user) => {
        if(!user){
            return {success: false,message: "No user found with that token"}
        }else{
            return {success: true,message: user}
        }
    }).catch((err) => {
        return {success: false, message: err}
    })
 };

 const ValidateUser = (data) => {
    return User.findByCredentials(data.email,data.password).then((user) => {
        if(user){
            return user.generateAuthToken().then((token) => {
                return {success: true, message: user,token}
            });
        }else{
            return {success: false,message: "No record found for that user"}
        } 
    }).catch((err) => {
        return {success: false, message: err}
    });
 };

 const RemoveUser = (token,id) => {
    return User.findByIdAndUpdate(id,{$pull: {tokens: {token}}}).then((user) => {
        return {success: true , message: user}
    }).catch((err) => {
        return {success: false, message: err}
    });
 }

 module.exports = {CreateUser,FetchUser,ValidateUser,RemoveUser};
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        unique: true,
        validate: {
            validator: function(value){
             return   validator.isEmail(value);
            },
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
},{timestamps: true});

//Schema method
UserSchema.methods.toJSON = function (){
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject,["_id","email"])
}

//Schema method
UserSchema.methods.generateAuthToken = function (){
    let user = this;
    const access = "Auth";

    const token = jwt.sign({_id: user._id.toHexString(),access},process.env.JWT_SECRET).toString();
    user.tokens = user.tokens.concat([{access,token}])

    return user.save().then(() => {
        return token;
    });
}

UserSchema.methods.removeToken = function(token){
    let user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
}



// Model methods
UserSchema.statics.findByToken = function(token){
    let User = this;
    let decoded;
    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET);
    } catch (error) {
        return Promise.reject();
    }

    return User.findOne({
        "_id": decoded._id,
        "tokens.token": token,
        "tokens.access": "Auth"
    });
}

UserSchema.statics.findByCredentials = function(email,password){
    let User = this;

    return User.findOne({email}).then((user) => {
        if(!user) return Promise.reject();

        return new Promise((resolve, reject) => {
             bcrypt.compare(password,user.password,(err,res) => {
                if(res) return resolve(user);
                else  reject();
            });
        });
    });
}

UserSchema.pre("save",function(next){
    let user = this;
    if(user.isModified("password")){
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(user.password,salt,function(err,hash){
                user.password = hash;
                next();
            })
        })
    }else{
        next();
    }
})

const User = mongoose.model("User",UserSchema);
module.exports = User
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    }
},{timestamps: true});


const User = mongoose.model("User",UserSchema);
module.exports = User
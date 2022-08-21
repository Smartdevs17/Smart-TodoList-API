const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},{timestamps: true});

const Todo = mongoose.model("Todo",TodoSchema);

module.exports = Todo;
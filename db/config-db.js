let mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true});
const connection = mongoose.connection;
connection.on("open",() => console.log("Connected to DB"));
connection.once("error",(error) => console.error(error.message));


module.exports = connection;
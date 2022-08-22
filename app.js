require("./config/config");
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const connection = require("./db/config-db");

const todoRoute = require("./routes/todo/todo");
const userRoute = require("./routes/user/user");


app.use(express.json());
app.use(cors());
app.use(morgan("common"));

app.use("/api/todos",todoRoute);
app.use("/api/users",userRoute);



const port = process.env.PORT;
app.listen(port,() => {
    console.log(`Server stated running on port ${port}`);
});


module.exports = app;
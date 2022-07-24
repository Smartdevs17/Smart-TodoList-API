const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const connection = require("./db/config-db");

const todoRoute = require("./routes/todo/todo");



app.use(express.json());
app.use(cors());
app.use(morgan("common"));

app.use("/api/todos",todoRoute);




const port = process.env.PORT || 5000;
app.listen(port,() => {
    console.log(`Server stated running on port ${port}`);
});


module.exports = app;
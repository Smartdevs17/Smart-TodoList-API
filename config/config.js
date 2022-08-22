let env = process.env.NODE_ENV || "development";

// if(env === "development"){
//     process.env.PORT = 5000;
//     process.env.MONGODB_URI = "mongodb://localhost:27017/smartTodoDB"
// }else if(env === "test"){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = "mongodb://localhost:27017/smartTodoDBTest"
// };

if( env === "development" || env === "test"  ){
    const config = require("./config.json");
    const envConfig = config[env];

    // console.log(envConfig)
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });

}

require("dotenv").config();
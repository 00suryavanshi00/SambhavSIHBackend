const app = require("./app");
const dotenv = require("dotenv")
const connectDatabase = require("./config/database");

//handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise Rejection`);
    process.exit(1);
})

dotenv.config({
    path:"backend/config/config.env"
});


//connecting to the db

connectDatabase();
// let PORT = process.env.PORT;
let server = app.listen(4000, ()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})

//console.log(sih); // => testing whether unhandledException is crashing the server or not
//unhandled promise rejection
process.on("unhandledRejection",err=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    })
})
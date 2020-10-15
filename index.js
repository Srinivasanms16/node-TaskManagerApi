//dotenv npm package is used only for loading enviroment variables in dev.
//for production for docker and container we can provide in docker run command 
//docker run -e PORT=3000 
require("dotenv").config();
const express = require('express');
require('./db/mongoose');
const userrouter = require("./router/userrouter");
const taskrouter = require("./router/taskrouter");
const uploadrouter = require("./router/fileuploadrouter");
const mailrouter = require("./router/emailrouter");
const authrouter = require("./router/authenticationrouter");



const server = express();

//its parse the body when the content-type is application/jason 
server.use(express.json());

//its parse the body when the content-type is application/x-www-form-urlencoded
server.use(express.urlencoded({extended:false}));


//middleware to log all the request.
server.use((req,res,next)=>{
    console.log(req.url);
    next();
})

//Maintance mode.
// server.use((req,res,next)=>{
//     res.status(503).send("API is in maintance mode !.")
//  })
    
server.use(authrouter);

server.use(userrouter);

server.use("/task",taskrouter);

server.use(uploadrouter);

server.use(mailrouter);

//check api is alive !
server.get("/test", (req,res)=>{
    
    res.status(200).send("server is live !");
})

//Error handler , it should be at the end.
server.use((err,req,res,next)=>{
    res.status(400).send(err);
})

console.log(process.env.PORT)
server.listen(process.env.PORT,()=>{
    console.log("Server Started at 3000")
})
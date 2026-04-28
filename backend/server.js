import express from "express";
// const express = require(express)
import cors from "cors";
import todoRoutes from "./routes/todos.js";

const app = express()
const portNumber = 5000

app.use(cors());        //Enabling cors so that the frontend can communicate with the server
app.use(express.json())     //Parse incoming json requests and put the data in json.body

app.use("/todos", todoRoutes);      //Any request from /todos will be handled by todoRoutes
// app.get("/", (req,res) => {
//     res.send("Welcome to PERN Stack ToDo application!");
// })
// Listeing for incoming requests
app.listen(portNumber, ()=>{
    console.log(`Server is listening on port ${portNumber}`)
})

// ======= Define the API endpoints and URLs to connect to frontend. Each endpoint corresponds to a CRUD operation ==============
import { Router } from "express";
import pool from "../database.js";

const router = Router();    //Creating a router object

// Create a new TODO/TASK
router.post("/", async (req,res)=>{     //Make the operation non-blocking with the async word
    try{
        const { description, completed } = req.body;        //Destructuring a TODO's details from the client
        const newToDo =  await pool.query(      //Talking to the database, and creating a new task
            "INSERT INTO ToDo (description, completed) VALUES ($1, $2) RETURNING *",        //$1 and $2 are parameterised queries, preventing SQL injection attacks. Returning * allows sending the responses back to the frontend
            [description, completed || false]
        );
        res.json(newToDo.rows[0]);      //Sending a response back to the frontend, if everything was successful
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occured trying to CREATE a task")
    }
});
// Get all the TODOs or tasks from the database
router.get("/", async (req,res)=>{
    try{
        const allToDos = await pool.query("SELECT * FROM ToDo");    //Fetching all tasks
        res.json(allToDos.rows);        //Sending all tasks back to the frontend
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occured trying to READ tasks");
    }
});
// Updating a task
router.put("/:id", async(req,res)=>{
    try{
        const { id } = req.params;
        const { description, completed } = req.body;
        const updateTodo =  await pool.query(
            "UPDATE ToDo SET description = $1, completed = $2 WHERE id = $3 RETURNING *",
            [description, completed, id]
        );
        if(updateTodo.rows.length === 0){
            return res.status(404).json({msg: "Task not found"});
        }
        res.json({ message: "UPDATE successful", todo: updateTodo.rows[0]});
    }
    catch(err){
        console.error(err)
        res.status(500).send("Error occured trying to UPDATE a task")
    }
})
// Deleting a task
router.delete("/:id", async(req,res)=>{
    try{
        const { id } = req.params;
        await pool.query(
            "DELETE FROM ToDo WHERE id = $1",
            [id]
        );
        res.json("Task successfully deleted");
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occured trying to DELETE a task");
    }
})

export default router;
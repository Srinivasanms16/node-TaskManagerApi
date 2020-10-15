const express = require("express");
const task = require("../db/models/task");
const taskmodel = require("../db/models/task");
const middleware = require("../middleware/authorize");


//

const router = express.Router();

router.use(middleware.authorize);

//get all task
router.get("/",async(req,res)=>{
    try{
     await req.user.populate("tasks").execPopulate()
     console.log(req.user.tasks)

    if(!req.user.tasks){
    res.status(404).send();
    }
    res.status(200).send({tasks:req.user.tasks});
    }
    catch(e){
        res.status(500).send(e);
    }
    });
    
    //get task by id
    router.get("/:id",async(req,res)=>{
    try{
        const _id = req.params.id;
        const result = await req.user.populate({
            path:'tasks',
            match:{
                _id
            }
        }).execPopulate();

       if(!result){
           res.status(404).send();
       }
       res.status(200).send({result:result.tasks});
    }
    catch(e){
        res.status(500).send();
    }
    });
    
    //create new task.
    router.post("/",async(req,res)=>{
        try{
        const task = new taskmodel({...req.body,"owner":req.user._id});
         const result = await task.save();
         res.status(201).send(result);
        }
        catch(ex){
            res.status(400).send(ex);
        }
    })
    
    //delete task by Id
    router.delete("/:id",async(req,res)=>{
        try {
    
            const _id = req.params.id;
            const result = await taskmodel.findOneAndDelete({_id,owner:req.user._id});
            
            if(!result){
                return res.status(404).send()
            }
    
            res.status(200).send({result});
            
        } catch (error) {
            res.status(500).send()
        }
    })
    
    // "$and":[{ "description":{"$regex":"^w","$options":"i"} },
    //{ "status":"not started"}] it will get the task whose description start with w and status is not started.
    
    router.post("/search",async(req,res)=>{
        try {
            
            const result = await req.user.populate({path:"tasks",
             match:req.body,
            options:{
                sort:"-createdAt",
                skip:0,
                limit:10    
            }}
             ).execPopulate()
            if(!result || result.length ==0)
            {
                return res.send("no data found for that search !")
            }
            res.send({result:result.tasks});
    
        } catch (error) {
            res.status(500).send();
        }
    })
    
    //Update the task.
    router.patch("/:id",async(req,res)=>{
    try {
        const _id = req.params.id;
        const result = await taskmodel.findOneAndUpdate({_id,owner:req.user._id},req.body,{runValidators:true});
        if(!result)
        {
            return res.status(404).send();
        }
        res.send(200).send(result);
    
    } catch (error) {
        res.status(500).send();
    }
    });
    
    module.exports = router;
    
    
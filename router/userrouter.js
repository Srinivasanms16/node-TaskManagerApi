const express = require('express');
const usermodel = require("../db/models/user");
const middleware = require("../middleware/authorize")
const router = express.Router();

//this middleware will check the user is valid guy and not logout and this also added new property to req name
//user which will logged user information.
router.use("/user",middleware.authorize);

//Added new User
router.post("/user",async (req,res)=>{
    
    try{
         if(req.user.roles.includes("admin"))
         {
    const user = new usermodel(req.body);
    const result =  await user.save();
    res.status(201).send(result);
        }
        res.status(404).send("not authorized !");
    }
    catch(ex){
      res.status(400).send(ex);
    }
})

//Get all user.
router.get("/user",async(req,res)=>{
    try{
        if(req.user.roles.includes("admin"))
        {
            const limit = Number(req.query.limit);
            const skip = Number(req.query.skip);
        
        const result = await usermodel.find({},null,{limit,skip});
        if(!result)
        {
            return res.status(404).send();
        }
        res.status(200).send(result);
    }
    res.status(404).send("Not admin");
    }
    catch(e)
    {
        res.status(500).send()
    }
})

//search user 
 //   "age":{"$gt" : 25} - it will give the user whose age is greater than 25.
//   "$and":[{"age":{"$gt":18}},{"name":{"$regex":"^a","$options":"i"}}]- will provide the user whose age is grater than 18 and his name start with a .
// skip and limit use for pagination.
router.post("/user/search",async (req,res,next)=>{
  try {
      if(!req.body.search)
      {
          next("no proper data");
      }
    const result = await usermodel.find(req.body.search)
    res.status(200).send(result);
  } catch (error) {
   next(error);   
  }
  
})



//get user by Id
router.get("/user/:id",async(req,res)=>{
    try{
        const _id = req.params.id;
        if(_id.includes(req.user._id))
        {
            await req.user.populate("tasks").execPopulate()
            res.status(200).send({user:req.user});
        }
        else
        {
            if(req.user.roles.includes("admin"))
            {
           const result = await usermodel.findOne({_id})
           if(!result)
           {
               return res.status(404).send();
           }
           res.status(200).send(result);
        }
        res.status(404).send("not authorized");
        }
    }
    catch(e){
        res.status(500).send(e);
    }
})

//delete user by Id
router.delete("/user/:id",async(req,res)=>{
    try {
      const _id = req.params.id;
      if(req.user.roles.includes("admin"))
    {
     const result = await usermodel.deleteOne({_id});
     if(!result)
     {
         return res.status(404).send(result);
     }
     res.status(200).send(result);
    }
    res.status(404).send("not authorozed !");  
    } catch (error) {
       res.status(500).send(); 
    }
})

//update user.
router.patch("/user/:id",async(req,res)=>{
try {
    
    const _id = req.params.id;
    if( req.user.roles.includes("admin"))
    {
    const result = await usermodel.updateOne({_id:_id},req.body,{runValidators:true});
    if(!result)
    {
      return res.status(404).send();
    }
    res.status(200).send()
}
res.status(404).send("not authorozed !");
} catch (error) {
    res.status(500).send(error);
}
});

module.exports = router;




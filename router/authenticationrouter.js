const express = require("express");
const usermodel = require("../db/models/user");
const middleware = require("../middleware/authorize");

const router = express.Router();



router.post("/login",async(req,res)=>{
    try {
         
        const {isValid,token} = await usermodel.verifiyUser(req.body.email,req.body.password);

        if(isValid)
        {
            res.status(200).send({token})
        }
        else
        {
            res.status(401).send();
        }
        
    } catch (error) {
        res.status(500).send(error);
    }
   
});

router.post("/logout",middleware.authorize,async (req,res)=>{

try{
      const isLoggedOut =  await usermodel.logOff(req.headers.authorization)
      if(isLoggedOut)
      {
       return res.status(200).send("Successfully Logged Out!");
      }
      res.status(400).send("not successfully logged out!");
    }
    catch(e)
    {
        res.status(500).send();
    }
})

router.post("/forcelogout",middleware.authorize,async (req,res)=>{
   
    try{
        const isLoggedOut = await usermodel.forceLogout(req.headers.authorization);
        if(isLoggedOut)
        {
         return res.status(200).send("Successfully Logged Out!");
        }
        res.status(400).send("not successfully logged out!");
      }
      catch(e)
      {
          res.status(500).send();
      }
})

module.exports = router;


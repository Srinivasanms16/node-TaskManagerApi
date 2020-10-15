const jwt = require("jsonwebtoken");
const usermodel= require("../db/models/user");

const authorize =async (req,res,next)=>{

    let token = req.headers.authorization;
    token = token.replace("Bearer ","")
    const userdata = jwt.verify(token,process.env.JWTSECRETKEY);
    if(userdata)
    {
     const user = await usermodel.findOne({_id:userdata._id});
     if(user.token.includes(token))
     {
         req.user = user; 
         return next()
     }
    }
    res.status(401).send("not authorized user");
}

module.exports.authorize = authorize;
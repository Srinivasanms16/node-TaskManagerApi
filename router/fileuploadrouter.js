const express = require("express");
const multer = require("multer");
const middleware = require("../middleware/authorize");

const router = express.Router();

router.use(middleware.authorize);



const fileFilter = async(req,file,cb)=>{

    if(!file.originalname.toString().trim().match(/\.(jpg|png)$/))
    {
       return cb("Please upload jpg and png type files",false);
    }
      cb(undefined,true)
}
    
    

const imageupload = multer({ fileFilter,
                             limits:{fileSize:500000}
                             });

 //we are using multiple multer intance for uploading different type of file , then its better to add the 
 // multer as middleware repestive to that CURD operation. 
 //if we add globally than , request containing multipart/formdata will handled by the global middleware.
 // which may cause validation issues .             
               
//router.use(imageupload.single("profileImage"));

router.post("/uploadimage",imageupload.single("profileImage"),async (req,res,next)=>{
    try {
        req.user.profileImage =   req.file.buffer;
        await req.user.save();
        res.status(200).send();
    } catch (error) {
        next(error);
    }
     
})

router.get("/removeimage",async(req,res,next)=>{
try {
    //console.log(req.user.name);
    req.user.profileImage = undefined;
    await req.user.save();

    res.status(200).send("removed image successfully !")

} catch (error) {
    next(error);
}
})

pdffileFilter = async(req,file,cb)=>{
  
if(!file.originalname.match(/\.(txt|pdf)$/)){
    return cb("file type not match",false)
}
cb(undefined,true);
}

const pdffiles = multer({fileFilter:pdffileFilter,limits:{
    fileSize:500000
}})

router.post("/uploaddocs",pdffiles.array("docs",3),async (req,res,next)=>{
    try {

        req.files.forEach(item=>{
            req.user.docs.push(item.buffer);
        })
   
        await req.user.save();
        res.status(200).send();
   
        
    } catch (error) {
        next(error);
    }
})

module.exports = router;
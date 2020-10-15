require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

//mail trap is Fake SMPT server for developer testing.
const transport = nodemailer.createTransport({
    host:process.env.MAILHOST,
    port:process.env.MAILPORT ,
    auth:{
        user:process.env.MAILUSER,
        pass:process.env.MAILPASS
    }
});

console.log(process.env.MAILHOST)

router.post("/sendmail",async (req,res,next)=>{
    try {

     const result=   await transport.sendMail({
            from: req.body.from,
            to: req.body.to,
            subject: req.body.subject,
            text: req.body.body
        });

        res.send(result.response)
        
    } catch (error) {
        next(error);
    }
})

module.exports = router;

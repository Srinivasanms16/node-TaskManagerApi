const mongoose = require('mongoose');
const { default: validator } = require('validator');
const validators = require('validator');

try{

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", { useNewUrlParser: true,  useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
   name:{
       type:String,
       required:true,
       trim:true
   } ,
   age:{
       type:Number,
       required:true,
       min:18
   },
   email:{
       type:String,
       required:true,
       trim:true,
       lowercase:true,
       validate(value){
           if(!validators.isEmail(value)){
               throw new Error("not a valid email address")
           }
       }
   },
   password:{
       type:String,
       required:true,
       trim:true,
       validate(value){
          if(!validator.isLength(value,{min:6}))
          {
            throw new Error("minimum lenght of password should be 6");
          }
          if(value.includes("password")){
              throw new Error("Password should not contain the string password!.");
          }
       }
   }
})

const user = mongoose.model("user",userSchema)

const user1 = new user({name:" nithin shivaa ",
                        age:4,
                        email:"SRINIVASAMS16@gmail.com ",
                        password:"123@abc"   });

user1.save().then((data)=>console.log(data)).catch((err)=>console.log(err));

const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true,
        validate(value){
            if(!validator.isLength(value,{min:5,max:100}))
            {
                throw new Error("characters in descriptions minimum is 5 and maximum is 100");
            }
        }
    },
    completed:{
        type:Boolean,
        default:false
    }
});

const Task = mongoose.model("task",taskSchema);

const task = new Task({description:"watching Tv"});

task.save().then((data)=>{console.log(data)}).catch((err)=>console.log(err));


}
catch(err){
    console.log(err);
}

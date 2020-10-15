const mongoose = require("mongoose");
const validators = require("validator");


const taskShema = new mongoose.Schema({
    description:{
    type:String,
    required:true,
    trim:true,
    lowercase:true,
    validate(value){
      if(!validators.isLength(value,{min:5,max:100}))
      {
        throw new Error("invalid desciption");
      }
    }
},
status:{
    type:String,
    default:"not started",
    enum:["not started","started","in progress","hault","completed"]
},
owner:{
  type:mongoose.Types.ObjectId,
  required:true,
  ref:"user"
}
},{timestamps:true})

const task = mongoose.model("task",taskShema);

module.exports = task;
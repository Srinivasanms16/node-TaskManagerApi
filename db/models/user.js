const mongoose = require('mongoose');
const validators = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const task = require("./task");



const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validators.isEmail(value)){
                throw new Error("invalid email address");
            }
        }
    },
    password:{
        trim:true,
        type:String,
        min:8,
        validate(value){
            if(value.includes("password"))
            {
                throw new Error("dont add password");
            }
        }
    },
    age:{
        type:Number,
        min:18,
        max:100
    },
    token:{
        type:[String],
    },
    roles:{
        type:[String],
        default:["view"]
    },
    profileImage:{
        type:Buffer
    },
    docs:{
        type:[Buffer]
    }
},{timestamps:true,
    toObject: {virtuals: true},
toJSON: {virtuals: true}
  });

//adding virtual property and using ref in that.
//we can populate this field and get the task Info related to that user.
userSchema.virtual("tasks",{
    ref:"task",
    localField:"_id",
    foreignField:"owner"
})

userSchema.virtual("name_email").get(function() {
    return this.name + ' ' + this.email;
  })

//WE are  not useing arrow function because , we need to excecute in the context of calling model.
userSchema.pre("save",async function(next){
    if(this.isModified("password"))
    {
        this.password = await bcrypt.hash(this.password,8);
    }
    next();
})

userSchema.pre('updateOne',async function(next){
    if(this.getUpdate().password)
    {
        const pass = await bcrypt.hash(this.getUpdate().password,8);
        this.setUpdate({password:pass});
    }
    next();
})

userSchema.pre("deleteOne",async function(next){
    debugger;
    await task.deleteMany({owner:this.getQuery()._id}); 
    next();
})

//this method will avaliable in model level.
userSchema.statics.verifiyUser = async function(email,password){
    try{
    const userInfo = await this.findOne({email:email});
    if(!userInfo)
    {
        throw new Error("no valid user");
    }
    const isValid = await bcrypt.compare(password,userInfo.password);
    const token = jwt.sign({_id:userInfo._id,roles:userInfo.roles},process.env.JWTSECRETKEY);
    userInfo.token = [...userInfo.token,token];
    userInfo.save();
    return {isValid,token};
}
catch(e)
{
    console.log(e);
}
}
//this method will avaliable in model level.
userSchema.statics.logOff = async function(token){
    try{
        debugger;
    token = token.replace("Bearer ","")
    const userID = jwt.decode(token);
    const userdata = await this.findOne({_id:userID._id});
    userdata.token = userdata.token.filter((tk)=>{
        return tk !== token;
    });
    await userdata.save();
    return true;
}
catch(e){
    console.log(e);
}
}

//this method will avaliable in model level.
userSchema.statics.forceLogout = async function(token){
    try {
    token = token.replace("Bearer ","")
    const userID = jwt.decode(token);
    const userInfo = await this.findOne({_id:userID._id});
    userInfo.token = [];
     await userInfo.save();
    return true;
    } catch (error) {
        
    } 
}

//this will be avalibale in instance of model.
//toJSON is usually called during serilization(JSON.Stringfy , res.send internally call JSON.Stringfy method) . when the javacript object can be modified before JSON.stringfy using toJSON method.
userSchema.methods.toJSON = function(){
    let user = {...this._doc};
    delete user.token;
    delete user.password;
    delete user.profileImage;
    delete user.docs;
    return {user};
}



const user = mongoose.model("user",userSchema);

module.exports = user;
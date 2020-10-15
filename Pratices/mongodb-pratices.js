const mongo = require('mongodb')

mongoclient = mongo.MongoClient

const ObjectId = mongo.ObjectID;


const url = "mongodb://127.0.0.1:27017";
const dbname = "task-manager";

// const id = new ObjectId();
// console.log(id);
// console.log(id.id);
// console.log(id.toHexString());

mongoclient.connect(url,{ "useUnifiedTopology": true },(error,client)=>{

    if(error)
    {
       return  console.log(error.message);
    }
    console.log("Connected Successfully !");

    const db = client.db(dbname);
    const userCollection = db.collection("user");
    const taskStatus = db.collection("taskstatus");

    //Adding data to mongoDb.
    // userCollection.insertOne({"name":"srini","age":32},(error,result)=>{
    //     console.log(result.ops)
    // })
    // userCollection.insertMany([{"name":"nithin","age":3},{"name":"aish","age":30}],(error,result)=>{
    //     console.log(`Inserted ${result.insertedCount} records`);
    // })
    
    // taskStatus.insertMany([{"task":"driving","status":"done"},
    // {"task":"swiming","status":"not done"},
    // {"task":"riding","status":"hold"}],(error,result)=>{
    //     if(error){
    //         return console.log(error.message);
    //     }
    //     console.log(result.ops)
    // })

    //Read or get the data.
    // userCollection.findOne({name:'srini'},(error,data)=>{
    //     if(error)
    //     {
    //         return console.log(error);
    //     }
    //     console.log(data)
    // })

    // userCollection.findOne({_id: new ObjectId("5f6f80f25817a17460d02b19")},(error,data)=>{
    //     if(error)
    //     {
    //         return console.log(error);
    //     }
    //     console.log(data)
    // })

    // const cursor = userCollection.find({name:'nithin'});
    // cursor.toArray((error,data)=>{
    //     if(error)
    //     {
    //         return console.log(error)
    //     }
    //     console.log(data)
    // })
    // cursor.count((error,count)=>{
    //     if(error){
    //         return console.log(error);
    //     }
    //     console.log(count);
    // })

    // taskStatus.findOne({_id:new ObjectId("5f6f81e42d50bc6714bf781a")},(error,data)=>{
    //     if(error){
    //         return console.log(error);
    //     }
    //     console.log(data);
    // })

    // const tcursor = taskStatus.find({status:'done'});
    // tcursor.toArray((error,data)=>{
    //     if(error){
    //         return console.log(error);
    //     }
    //     console.log(data);
    // })

    //update data.
    // userCollection.updateOne({_id:new ObjectId("5f6f80f25817a17460d02b18")},{$set:{name:"Nithin Shivaa S"}})
    // .then((result)=>{console.log(result)})
    // .catch((err)=>{console.log(err)})
   
    // userCollection.updateOne({_id:new ObjectId("5f6f80f25817a17460d02b18")},{$inc:{age:1}})
    // .then((data)=>{console.log(data)})
    // .catch((error)=>{console.log(error)})

    // taskStatus.updateMany({},{$set:{status:'done'}}).then((data)=>{console.log(data)})
    // .catch((err)=>{console.log(err)})

    // userCollection.deleteMany({age:30}).then((data)=>{console.log(data)})
    // .catch((err)=>{console.log(err)})

    //taskStatus.deleteOne({task:'watching TV'}).then((data)=>{console.log(data)}).catch((err)=>{console.log(err)})


});


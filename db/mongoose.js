const mongoose = require('mongoose');

try{
    console.log(process.env.MONGOODB)
      mongoose.connect(process.env.MONGOODB,{ useNewUrlParser: true,  
      useUnifiedTopology: true,
      useCreateIndex: true})
}
catch(ex)
{
    console.log(ex);
}
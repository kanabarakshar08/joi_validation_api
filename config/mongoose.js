const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1/adminpenal_task_2");
const db = mongoose.connection;
db.once('open',(err)=>{
    if(err){
        console.log("somthing went wrong...");
    }
    else{
        console.log(`mongodb coneted successfully`);
    }   
})
module.exports=db;

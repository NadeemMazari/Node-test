const mongoose = require("mongoose");
require("dotenv").config();
exports.mongoConnection=()=>{

    mongoose.connect(process.env.MONGODB_URL).then((e)=>{
        console.log('Connected to database')
    }).catch(e=>console.log(e))
}
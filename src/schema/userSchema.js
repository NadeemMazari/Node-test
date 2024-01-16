const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true

    },
    password:{
        type: String,
        required: true
    },
},
{timestamps:true}
)

userSchema.plugin(passportLocalMongoose);


const userModel= mongoose.model("users", userSchema)
module.exports=userModel
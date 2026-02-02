const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{type:String,unique:true},
    name:String,
    password:String,
    mobile:String,
    Profile:String
},
{timestamps:true}
);

mongoose.model("UserInfo",userSchema);
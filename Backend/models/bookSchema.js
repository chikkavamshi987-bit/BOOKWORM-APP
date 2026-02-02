const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title:String,
    caption:String,
    image:String,
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref :"UserInfo",
        required:true,
        
    }
},
{timestamps:true}
);

mongoose.model('BookSchema',bookSchema);
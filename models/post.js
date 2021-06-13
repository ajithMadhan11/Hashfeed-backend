const mongoose = require('mongoose');

const {Schema}=mongoose;

const {ObjectId} =Schema;

const postSchema = Schema({
    title:{
        type:String,
        required:true, 
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    max_participants:{
        type:Number,
        default:100
    },
    category:{
        type:ObjectId,
        ref:"Category",
        required:true
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    participants:{
        type:Array,
        default:[]
    },
    link:{
        type:String,
    },
    owner:{
        type:ObjectId,
        ref:"User",
        required:true
    }
  
},{timestamps:true})

module.exports=mongoose.model("Post",postSchema);
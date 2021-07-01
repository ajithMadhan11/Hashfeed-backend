const mongoose = require('mongoose');
const {Schema} = mongoose;
const crypto =require('crypto');
const { v4: uuidv4 } = require('uuid');
const {ObjectId} =Schema;
const UserSchema = Schema({
    name:{
        type:String,
        required:true,
        maxlength:32,
        trim: true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    phone_number:{
        type:String,
        trim:true,
    },
    encry_password:{
        type:String,
        required:true
    },
    salt:String,
    role:{
        type:Number,
        default:0
    },
    events:[{type:ObjectId,
        ref: 'Post'
    }],
    premium:{
        type:Number,
        default:0
    }

},{timestamps:true})


UserSchema.virtual("password")
    .set(function(password){
        this._password=password
        this.salt=uuidv4();
        this.encry_password=this.securePassword(password)
    })
    .get(function(){
        return this._password
    })

UserSchema.methods={

    authenticate:function(plainpassword){
        return this.securePassword(plainpassword)===this.encry_password
    },


    securePassword:function(plainpassword){
        if(!plainpassword) return "";
        try{
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
        }catch(err){
            return ""
        }
    }
}



module.exports=mongoose.model("User",UserSchema)
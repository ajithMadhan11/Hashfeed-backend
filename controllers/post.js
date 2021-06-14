const formidable = require('formidable')
const Post = require("../models/post")
const _ = require("lodash");
const fs = require('fs')

exports.getPostById=(req,res,next,id)=>{
   Post.findById(id)
   .populate("category")
   .populate("owner")
   .exec((err,post)=>{
       if(err){
           return res.status(400).json({
               message:"No Post found"
           })
       }
       req.post=post;
       next();
   })

}

exports.getPost=()=>{
    
}

exports.addPost=(req,res)=>{
let form = new formidable.IncomingForm();
form.keepExtensions=true;

form.parse(req,(err,fields,file)=>{
  
    if(err){
        return res.status(400).json({
            message:"There is a problem with your Image"
        })
    }

    const{title,description,category}=fields;

    if(!title || !description || !category){
        return res.status(400).json({
            message:"please include all fields"
        })
    }
    let post =new Post(fields);
   
    if(file.photo){
        if(file.photo.size>3000000){
            return res.status(400).json({
                message:"File size is too large"
            })
        }
    }
    console.log(post.photo);
    post.photo.data=fs.readFileSync(file.photo.path);
    post.photo.contentType=file.photo.type;


    //TODO:populate user
    post.save((err,post)=>{
        console.log(err);
        if(err){
            return res.status(400).json({
                message:"Error saving file in DB"
            })
        }
        res.json(post)
    })
 

})
}

  
   
exports.getAllPost=()=>{

}

exports.updatepost=()=>{

}

exports.isOwnPost=()=>{

}

exports.delPost=()=>{

}

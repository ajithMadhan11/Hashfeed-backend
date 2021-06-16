const formidable = require('formidable')
const Post = require("../models/post")
const _ = require("lodash");
const fs = require('fs')
const mongoose = require('mongoose');
const {Schema}=mongoose;

exports.getPostById=(req,res,next,id)=>{
   Post.findById(id)
   .populate("category")
   .populate("owner")
   .exec((err,post)=>{
       if(err){
           return res.status(400).json({
               message:"No Post found :("
           })
       }
       req.post=post;
       next();
   })

}

exports.getPost=(req,res)=>{
 res.json(req.post)
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
    post.owner=req.profile._id;

    if(file.photo){
        if(file.photo.size>3000000){
            return res.status(400).json({
                message:"File size is too large"
            })
        }
           
    post.photo.data=fs.readFileSync(file.photo.path);
    post.photo.contentType=file.photo.type;
    }
 


    post.save((err,post)=>{      
        if(err){
            return res.status(400).json({
                message:"Error saving file in DB"
            })
        }
        res.json(post)
    })   
})
}
   
exports.getAllPost=(req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  
    Post.find()
      .select("-photo")
      .populate("category")
      .sort([[sortBy, "asc"]])
      .limit(limit)
      .exec((err, post) => {
        if (err) {
          return res.status(400).json({
            error: "NO product FOUND"
          });
        }
        res.json(post);
      });
    
       
   
}

     
exports.updatepost=(req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions=true;
   
    form.parse(req,(err,fields,file)=>{
      
        if(err){
            return res.status(400).json({
                message:"There is a problem with your Image"
            })
        }
       
        let post =req.post;
        post = _.extend(post, fields);
       
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    message:"File size is too large"
                })
            }
            post.photo.data=fs.readFileSync(file.photo.path);
            post.photo.contentType=file.photo.type;
        }
        console.log(post);
        post.save((err,post)=>{   
            if(err){
                return res.status(400).json({
                    message:"Error updating file in DB"
                })
            }
            res.json(post)
        })
    })
}

exports.isOwnPost=(req,res,next)=>{
  if(_.isEqual(req.post.owner._id,req.profile._id)){
    next();
  }else{
      return res.status(300).json({
          message:"You are not authosrized to delete this post"
      })
  
  }
 

}

exports.delPost=(req,res)=>{
    const post = req.post;
    post.remove((err,post)=>{
        if(err){
            return res.status(400).json({
                message:"Error deleting the post"
            })
        }
        res.json(`${post._id} has been deleted successfully`)
    })
}

exports.addParticipants=(req,res)=>{
    let participant={
        id:req.profile._id,
        name:req.profile.name,
        email:req.profile.email
    }
    Post.updateOne({_id:req.post._id},{ $push: { participants: participant }},(err,rawRes)=>{
            if(err){
                return res.status(400).json({
                    message:"Failed joing in this Event"
                })
            }
            res.json(rawRes)
    })
}
//TODO:Check error afer submitting
exports.checkDuplicateParticpant=(req,res,next)=>{
    let partList=req.post.participants;
    partList.forEach((part)=>{
        if(_.isEqual(part.id,req.profile._id)){
            return res.status(403).json({
                message:"You have already joined in this event"
            })
        }
    });

    next();
}
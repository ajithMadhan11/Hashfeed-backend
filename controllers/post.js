const formidable = require('formidable')
const Post = require("../models/post")
const User = require("../models/user")
const _ = require("lodash");
const fs = require('fs')
const mongoose = require('mongoose');
const {Schema}=mongoose;

exports.getPostById=(req,res,next,id)=>{
   Post.findById(id)
   .populate("category")
   //.populate("owner")
   .exec((err,post)=>{
       if(err){
           return res.status(400).json({
               error:"No Post found :("
           })
       }
       req.post=post;
       
       next();
       
   })

}

const pushPostToUserArray=(profile,post)=>{
    User.updateOne({_id:profile},{ $push: { events: post }},(err,rawRes)=>{
        if(err){
            return res.status(400).json({
                error:"Failed adding evnet to user"
            })
        }
       
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
            error:"There is a problem with your Image"
        })
    }

    const{title,description,category,date}=fields;

    if(!title || !description || !category || !date){
        return res.status(400).json({
            error:"please include all fields"
        })
    }
    let post =new Post(fields);
    post.owner=req.profile._id;

    if(file.photo){
        if(file.photo.size>3000000){
            return res.status(400).json({
                error:"File size is too large"
            })
        }
           
    post.photo.data=fs.readFileSync(file.photo.path);
    post.photo.contentType=file.photo.type;
    }
 


    post.save((err,post)=>{      
        if(err){
            return res.status(400).json({
                error:"Error saving file in DB"
            })
        }
        res.json(post)
        pushPostToUserArray(req.profile._id,post._id); 
    })  
   
})
}
   
exports.getAllPost=(req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  
    Post.find()
    //   .select("-photo")
      .populate("category")
      .sort([[sortBy, "asc"]])
      .limit(limit)
      .exec((err, post) => {
        if (err) {
          return res.status(400).json({
            error: "NO Post FOUND"
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
                error:"There is a problem with your Image"
            })
        }
       
        let post =req.post;
        post = _.extend(post, fields);
       
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error:"File size is too large"
                })
            }
            post.photo.data=fs.readFileSync(file.photo.path);
            post.photo.contentType=file.photo.type;
        }
        console.log(post);
        post.save((err,post)=>{   
            if(err){
                return res.status(400).json({
                    error:"Error updating file in DB"
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
          error:"You are not authosrized to make changes to this post"
      })
  
  }
 

}

exports.delPost=(req,res)=>{
    const post = req.post;
    post.remove((err,post)=>{
        if(err){
            return res.status(400).json({
                error:"Error deleting the post"
            })
        }
        res.json(`${post._id} has been deleted successfully`)
    })
}
exports.checkDuplicateParticpant= (req,res,next)=>{
    let flag=0;
    let partList=req.post.participants;
     partList.forEach((part)=>{
       if(_.isEqual(part.id,req.profile._id)){
           flag=1;
        }
    });
    if(flag==0){
        next();
    }else{
        return res.status(400).json({
            error:"You have already joined in this event"
        })
    }
   
}

exports.isJoinedAlready = (req,res)=>{
    let partList=req.post.participants;
    let flag=0;
    partList.forEach((part)=>{
        if(_.isEqual(part.id,req.profile._id)){
           flag=1;
        }
    })
    if(flag){
        return res.status(400).json({
            error:"You have already joined in this event"
        })
    }else{
        return res.json({
            message:true
        })
    }
  }

exports.addParticipants=(req,res)=>{
    let participant={
        id:req.profile._id,
        name:req.profile.name,
        email:req.profile.email
    }
    // let j_event ={
    //     id:req.post._id,
    //     title:req.post.title,
    //     date:req.post.date,
    //     link:req.post.link,
    // }

    Post.updateOne({_id:req.post._id},{ $push: { participants: participant }},(err,rawRes)=>{
            if(err){
                return res.status(400).json({
                    error:"Failed joing in this Event"
                })
            }
            res.json({
                message:"Joined in Event Successfully!"
            })
    })
    // User.updateOne({_id:req.profile._id},{ $push: { joinedEvents: j_event }},(err,rawRes)=>{
    //         if(err){
    //             return res.status(400).json({
    //                 error:"Failed joing in this Event 2"
    //             })
    //         }
    //         res.json({
    //             message:"Joined in Event Successfully! 2"
    //         })
    // })
}

exports.participantsOfaEvent=(req,res)=>{
    res.json(req.post.participants)
}
exports.photo = (req, res, next) => {
    if (req.post.photo.data) {
      res.set("Content-Type", req.post.photo.contentType);
      return res.send(req.post.photo.data);
    }
    next();
  };

exports.getuserpost=(req,res)=>{
    // let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
   
    const id=req.profile._id
        User.findOne(id)
    .populate('events')
    .select("-photo")
    .sort([[sortBy, "desc"]])
    .exec((err,posts)=>{
        if(err){
            return res.status(400).json({
                error:"Something went wrong while fetching user posts"
            })
        }
        else{
            res.json(posts.events)
        }
})
}

// exports.joinInEvent =(req,res)=>{
//     let j_event ={
//         id:req.post._id,
//         title:req.post.title,
//         date:req.post.date,
//         link:req.post.link,
//     }

//     User.updateOne({_id:req.profile._id},{ $push: { joinedEvents: j_event }},(err,rawRes)=>{
//         if(err){
//             console.log(err);
//             return res.status(400).json({
//                 error:"Failed to Add participant to user model"
//             })
//         }
//         res.json({
//             message:"added user to event Successfully!"
//         })
// })
// }



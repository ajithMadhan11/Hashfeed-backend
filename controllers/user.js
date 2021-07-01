const user = require("../models/user")




exports.getUserById=(req,res,next,id)=>{
user.findById(id).exec((err,user)=>{
    if(err || !user){
        console.log(err)
        return res.status(400).json({
            error:"No user found :("
        })
    }
    req.profile=user;
    next();
})
}

exports.getUser=(req,res)=>{
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile)
}

exports.updateUser=(req,res)=>{
    user.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,user)=>{
            if(err){
              return  res.status(400).json({
                  error:"You are not authorized to make changes"
              })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            res.json(user)
        }
    )
}

exports.getUserEvents=(req,res)=>{
    let events=req.profile.events;
    res.json(events)
   
}


exports.getPremiumUsers=(req,res)=>{
//   let pre= user.find( { premium: { $eq:1 } } )
    // let preUsers= user.find( { premium: { $eq:1 } } )
    // while (preUsers.hasNext()) {
    //     console.log(tojson(preUsers.next()));
    // }
    user.find({premium: { $eq: 1 }}).exec((err,users)=>{
        if(err || !users){
            return res.status(400).json({
                error:"Error retriving users"
            })
        }
        res.json(users)
    })
}
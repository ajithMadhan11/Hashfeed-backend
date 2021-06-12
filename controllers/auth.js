const User = require('../models/user')
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


//Signin Controller
exports.signin =(req,res)=>{

const {email,password}= req.body;

User.findOne({email},(err,user)=>{
    if(err || !user){
       return res.status(400).json({
            message:"No user found"
        })
    }
    if(!user.authenticate(password)){
       return res.status(400).json({
            message:"Password Doesn't match"
        })
    }

    const token = jwt.sign({ id:user._id}, process.env.SECRET);
    res.cookie("token",token,{expire:new Date()+999});

    const{_id,name,email,role} = user;
    return res.json({
        token:token,
        id:_id,
        name:name,
        email:email,
        role:role,
        
    })

})
    
}

//Signup controller
exports.signup =(req,res)=>{
    console.log("came");
    const user=new User(req.body);
    user.save((err,user)=>{
        if(err){
           return res.status(400).json({
                message:"Error saving user to DB"
            })
        }
        return res.json({
            name:user.name,
            email:user.email,
            id:user._id
        })
    })
}

//signout controller
exports.signout =(req,res)=>{
    res.clearCookie("token")

    return res.json({
        message:"Logged out successully"
    })
}



//Protected Route
exports.isSignedIn = expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth",
    algorithms: ['sha1', 'RS256', 'HS256'],
});


//custom middle ware
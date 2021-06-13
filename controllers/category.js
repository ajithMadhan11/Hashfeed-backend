
const Category = require('../models/category')


exports.getCategoryById=(req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err){
            return res.status(400).json({
                message:"category not found"
            })
        }
        req.category=category;
        next();
    })
}
exports.getCategory=(req,res)=>{
  return res.json(req.category)
}

exports.getAllCategory=(req,res)=>{
    Category.find().exec((err,items)=>{
        if(err){
            return res.status(400).json({
                message:"No categories found"
            })
        }
        res.json(items)
    })
}

exports.addCategory=(req,res)=>{
    const category = new Category(req.body)
    category.save().exec((err,category)=>{
        if(err){
            return res.status(400).json({
                message:"Error saving dcategory in DB"
            })
        }
        res.json(category)
    })
}

exports.updateCategory=(req,res)=>{

    Category.findByIdAndUpdate(
        {_id:req.category._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,category)=>{
            if(err){
              return  res.status(400).json({
                  message:"You are not authorized to make changes"
              })
            }
           
            res.json(category)
        }
    )
}

exports.delCategory=()=>{
//
}
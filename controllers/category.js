
const Category = require('../models/category')


exports.getCategoryById=(req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err){
            return res.status(400).json({
                error:"category not found"
            })
        }
        req.category=category;
        next();
    })
}
exports.getuniquecategory=(req,res)=>{
   return res.json(req.category)
}

exports.getCategory=(req,res)=>{
  return res.json(req.category)
}

exports.getAllCategory=(req,res)=>{
    Category.find().exec((err,items)=>{
        if(err){
            return res.status(400).json({
                error:"No categories found"
            })
        }
        res.json(items)
    })
}

exports.addCategory=(req,res)=>{
    const category = new Category(req.body)
    category.save((err,category)=>{
        if(err){
            return res.status(400).json({
                error:"Error saving category in DB"
            })
        }
        res.json(category)
    })
}

exports.updateCategory=(req,res)=>{

    const category = req.category;
    category.name=req.body.name;

    category.save((err,updatedCategory)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                error:"Update category FAILED"
            })
        }
        res.json(updatedCategory)
    });
}

exports.delCategory=(req,res)=>{
    const category =req.category;
    category.remove((err,category)=>{
        if(err){
            return res.statue(400).json({
                error:"delete category failed"
            })
        }
        res.send(`${req.category.name} is deleted successfully`)
    })
}
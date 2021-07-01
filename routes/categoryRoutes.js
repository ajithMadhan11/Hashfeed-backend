const express= require('express');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getCategoryById, getCategory, getAllCategory,getuniquecategory, addCategory, updateCategory, delCategory } = require('../controllers/category');
const { getUserById } = require('../controllers/user');
const router=express.Router();


router.param('userId',getUserById)
router.param('categoryId',getCategoryById)

router.get('/category/:userId/:categoryId',isSignedIn,isAuthenticated,isAdmin,getCategory)
router.get('/category/:categoryId',getuniquecategory)
router.get('/categories',getAllCategory)


router.post('/category/add/:userId',isSignedIn,isAuthenticated,isAdmin,addCategory)

router.put('/category/update/:userId/:categoryId',isSignedIn,isAuthenticated,isAdmin,updateCategory)

router.delete('/category/delete/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,delCategory)

module.exports=router;
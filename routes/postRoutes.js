const express = require('express');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getPostById, getPost, addPost, updatepost, getAllPost, delPost, isOwnPost } = require('../controllers/post');
const { getUserById } = require('../controllers/user');
const router = express.Router();

router.param('postId',getPostById)
router.param('userId',getUserById)

router.post('/post/add/:userId',isSignedIn,isAuthenticated,addPost)


router.put('/post/add/:userId',isSignedIn,isAuthenticated,isOwnPost,updatepost)


router.get('/post/:postId',getPost)
router.get('/post/all',getAllPost)


router.delete('/post/delete/:postId',isSignedIn,isAuthenticated,isOwnPost,delPost)
router.delete('/post/delete/admin/:postId',isSignedIn,isAuthenticated,isAdmin,delPost)

module.exports=router;


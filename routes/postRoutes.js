const express = require('express');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { getPostById, getPost, addPost } = require('../controllers/post');
const { getUserById } = require('../controllers/user');
const router = express.Router();

router.param('postId',getPostById)
router.param('userId',getUserById)

router.post('/post/add/:userId',isSignedIn,isAuthenticated,addPost)
router.get('/post/:postId',getPost)

module.exports=router;
const express = require('express');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getPostById, getPost, addPost, updatepost, getAllPost, delPost, isOwnPost, addParticipants, checkDuplicateParticpant } = require('../controllers/post');
const { getUserById } = require('../controllers/user');
const router = express.Router();

router.param('postId',getPostById)
router.param('userId',getUserById)

router.post('/post/add/:userId',isSignedIn,isAuthenticated,addPost)


router.put('/post/update/:postId/:userId',isSignedIn,isAuthenticated,isOwnPost,updatepost)
router.put('/post/join/:postId/:userId',isSignedIn,isAuthenticated,checkDuplicateParticpant,addParticipants)


router.get('/post/:postId',getPost)
router.get('/posts',getAllPost)



router.delete('/post/delete/:postId/:userId',isSignedIn,isAuthenticated,isOwnPost,delPost)
// router.delete('/post/delete/admin/:postId',isSignedIn,isAuthenticated,isAdmin,delPost)

module.exports=router;


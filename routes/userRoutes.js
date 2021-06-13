const express = require('express');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { getUser , getUserById , updateUser , getUserEvents} = require('../controllers/user');
const router = express.Router();



router.param('userId',getUserById)

router.get('/user/:userId',isSignedIn,isAuthenticated,getUser)

router.put('/user/update/:userId',isSignedIn,isAuthenticated,updateUser)

router.get('/user/events/:userId',isSignedIn,isAuthenticated,getUserEvents)


module.exports=router;
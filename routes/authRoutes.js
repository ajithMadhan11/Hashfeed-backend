const express = require('express');
const router = express.Router();

const {signin,signup,signout, isSignedIn} = require("../controllers/auth")

//Sign in

router.post('/signin',signin)

//Sign up

router.post('/signup',signup)


//Sign out

router.get('/signout',signout)



module.exports=router;
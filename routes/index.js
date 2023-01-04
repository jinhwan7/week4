const express = require('express');
const router = express.Router();

const signupRouter = require('./signup.js');
const loginRouter = require('./login.js');
const postsRouter = require('./posts.js');
const commentRouter = require('./comment.js');


router.use('/signup', signupRouter);
router.use('/login',loginRouter);
router.use('/posts',postsRouter);
router.use('/comments',commentRouter);


module.exports = router;
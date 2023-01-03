const express = require('express');
const { TokenExpiredError } = require('jsonwebtoken');
const router = express.Router();
const validToken = require('../middlewear/validToken.js')
const { Posts } = require('../models/index.js');
const { User } = require('../models/index.js');

router.get('/', async (req, res) => {
    const postGroup  = JSON.stringify(await Posts.findAll({}));
    console.log(postGroup);

    res.send('잘되어요');
});

router.post('/' ,validToken, async (req, res) => {
    const { title, content } = req.body;
   
    const nickname = res.locals.nickname;
    
    const findthing = await User.findOne({
        attributes: ['userId'],
        where: {
            nickname: nickname,
        },
    });
    const { userId }  =  JSON.parse(JSON.stringify(findthing));
   
    await Posts.create({
        
        userId: userId,
        title: title,
        content:content
    });
    

    //console.log(title, content)
    res.status(200).json({ message: "게시글 작성완료" })
});

module.exports = router;
const express = require('express');
const { TokenExpiredError } = require('jsonwebtoken');
const router = express.Router();
const validToken = require('../middlewear/validToken.js')
const { posts } = require('../models/index.js');
const { User } = require('../models/index.js');

router.get('/', (req, res) => {
    res.send('잘되어요');
});

token()
router.post('/' ,validToken, async (req, res) => {
    const { title, content } = req.body;
    console.log(res.cookie);
    const nickname = res.locals.nickname;
    console.log('이거나오나요',nickname);
    const userId = await User.findOne({
        attributes: ['userId'],
        where: {
            nickname: nickname,
        },
    });

    await posts.create({
        userId: userId,
        title: title,
        content:content
    });
    

    //console.log(title, content)
    res.status(200).json({ message: "게시글 작성완료" })
});

module.exports = router;
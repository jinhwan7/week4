const express = require('express');
const { TokenExpiredError } = require('jsonwebtoken');
const router = express.Router();
const validToken = require('../middlewear/validToken.js')
const { Posts } = require('../models/index.js');
const { User } = require('../models/index.js');

router.post('/', validToken, async (req, res) => {
    const { title, content } = req.body;

    const nickname = res.locals.nickname;

    const findthing = await User.findOne({
        attributes: ['userId'],
        where: {
            nickname: nickname,
        },
    });
    const { userId } = JSON.parse(JSON.stringify(findthing));

    await Posts.create({

        userId: userId,
        title: title,
        content: content
    });


    //console.log(title, content)
    res.status(200).json({ message: "게시글 작성완료" })
});

router.get('/', async (req, res) => {
    const postGroup = await Posts.findAll({
        
        include: [{
            model: User,
            attributes: ['nickname']
        }]
    });
    console.log(postGroup);











    // console.log('--------------------');
    // console.log(postGroup)
    // console.log(postGroup[0].Posts);
    // const result = postGroup.map(user => {
    // const nickname = post.nickname;
    // const nick = user.Posts.map(post => post);
    // return {
    //     "postId": post.postId,
    //     "userId": post.UserId,
    //     "nickname": user.nickname,
    //     "content": post.content,
    //     "createdAt": post.createdAt,
    //     "updatedAt": post.updatedAt,
    // }

    res.status(200).json({ data: postGroup });
});


router.get('/:postId', async (req, res) => {
    const { postId } = req.params;
    console.log(postId);
    res.json({ message: "잘되요" });
});

module.exports = router;
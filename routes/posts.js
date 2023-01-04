const express = require('express');
const { TokenExpiredError } = require('jsonwebtoken');
const router = express.Router();
const validToken = require('../middlewear/validToken.js')
const { Posts } = require('../models/index.js');
const { User } = require('../models/index.js');

//게시글 작성
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


//게시글 조회
router.get('/', async (req, res) => {
    const postGroup = await Posts.findAll({

        include: [{
            model: User,
            attributes: ['nickname']
        }]
    });

    const postGroutgen = JSON.parse(JSON.stringify(postGroup));
    const result = postGroutgen.map(postnick => {
        return {
            postId: postnick.postId,
            userId: postnick.userId,
            nickname: postnick.User.nickname,
            title: postnick.title,
            content: postnick.content,
            createdAt: postnick.createdAt,
            updatedAt: postnick.updatedAt
        }
    });


    res.status(200).json({ data: result });
});


//게시글 상세조회
router.get('/:postId', async (req, res) => {

    const { postId } = req.params;
    const excistPost = await Posts.findAll({
        where: { postId: postId }
    });
    if (!excistPost.length) {
        return res.status(404).send({ message: "그런 게시글은 없습니다" })
    }

    const postGroup = JSON.parse(JSON.stringify(await Posts.findOne({
        where: { postId: postId },
        include: [{
            model: User,
            attributes: ['nickname']
        }]
    })));

    postGroup.nickname = postGroup.User.nickname
    delete postGroup.User

    res.status(200).json({ data: postGroup });
});


//게시글 수정
router.put('/:postId', validToken, async (req, res) => {
    const nickname = res.locals.nickname;
    const { postId } = req.params;
    const { title, content } = req.body;
    const excistPost = await Posts.findAll({
        where: { postId: postId },
        include: [{
            model: User,
            attributes: ['nickname'],
            where: { nickname: nickname }
        }],

    });
    //console.log("11111",excistPost)
    if (!excistPost.length) {
        return res.status(404).send({ message: "그런 게시글이 없거나 본인이 작성한 게시글이 아닙니다" })
    }
    await Posts.update({
        title: title,
        content: content
    }, {
        where: { postId: postId }
    });

    console.log('수정됨');



    res.status(200).send({ message: "게시글을 수정하였습니다" });
});


//게시글 삭제
router.delete('/:postId', validToken, async (req, res) => {
    const { postId } = req.params;
    const nickname = res.locals.nickname;

    const existPost = await Posts.findAll({
        where: { postId: postId },

        include: [{
            model: User,
            where: { nickname: nickname }
        }]
    });
    if (!existPost.length) {
        return res.status(404).send({ message: "없는 게시글이거나 본인이쓴 게시글이 아닙니다" })
    }

    
        await Posts.destroy({
            where: { postId: postId },
        });

    res.status(200).send({ message: "게시글 삭제완료" });

});

module.exports = router;
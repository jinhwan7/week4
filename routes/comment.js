const express = require('express');
const router = express.Router();
const { Comment } = require('../models/index.js');
const { Posts } = require('../models/index.js');
const { User } = require('../models/index.js');
const validToken = require('../middlewear/validToken.js');
const { Op } = require('sequelize');


//댓글 생성
router.post('/:postId', validToken, async (req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = res.locals.userId;


    await Comment.create({
        postId: postId,
        userId: userId,
        comment: comment
    });



    res.send({ message: "댓글작성 성공" });
});


//댓글 목록 조회
router.get('/:postId', async (req, res) => {
    const { postId } = req.params;
    const commentGroup = await Comment.findAll({
        where: { postId: postId },
        include: [{
            model: User,
            attributes: ['nickname']
        }],
    });
    if (!commentGroup.length) {
        return res.status(400).send({ message: "게시글이 없습니다" })
    }
    const result = commentGroup.map(comments => {
        return {
            commentId: comments.commentId,
            userId: comments.userId,
            nickname: comments.User.nickname,
            comment: comments.comment,
            createdAt: comments.createdAt,
            updatedAt: comments.updatedAt
        }
    });

    res.send({ data: result });
});

//게시글 수정
router.put('/:commentId', validToken, async (req, res) => {
    const { commentId } = req.params;
    const { comment } = req.body;
    const userId = res.locals.userId;
    console.log(userId);
    const commentGroup = await Comment.findAll({
        where: { commentId: commentId },
    });

    if (!commentGroup.length) {
        return res.status(400).send({ message: "댓글이 없습니다" })
    }



    const iscommentUpdate = await Comment.update({
        comment: comment,
    }, {
        where: {
            [Op.and]: [{ commentId: commentId }, { userId: userId }]
        }
    })
    if (!iscommentUpdate[0]) {
        res.status(400).send({ message: "본인인 쓴 댓글이 아닙니다" });
    }else{
        res.status(200).send({ message: "수정되었습니다" });
    }
    

});

module.exports = router;
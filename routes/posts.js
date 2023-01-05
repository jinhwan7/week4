const express = require('express');
const { TokenExpiredError } = require('jsonwebtoken');
const router = express.Router();
const validToken = require('../middlewear/validToken.js')
const { Posts } = require('../models/index.js');
const { User } = require('../models/index.js');
const { Like } = require('../models/index.js');
const { sequelize } = require('../models/index.js');
const { Op } = require('sequelize');


//좋아요 조회
router.get('/like',validToken, async (req, res) => {

    const userId = res.locals.userId;

    const result = await Posts.findAll({
        attributes:[
            "postId",
            "userId",
            "title",
            "createdAt",
            "updatedAt",
            [sequelize.fn('COUNT',sequelize.col('Likes.postId')),'likes']
        ],
        include:[{
            model:User,
            attributes:['nickname']
        },
        {
            model:Like,
            attributes: [],
            where: {
                [Op.and]: [{ UserId: userId }],
            }
        }
    ],
        group: ['Posts.postId'],

    })
    const myLikedPost = JSON.parse(JSON.stringify(result)).map( row => {
        const createAt_Ko = new Date(row.createdAt)
        createAt_Ko.setHours(createAt_Ko.getHours() + 9);

        const updatedAt_Ko = new Date(row.createdAt)
        updatedAt_Ko.setHours(createAt_Ko.getHours() + 9);

        return {
           postId : row.postId,
           userId : row.userId,
           createAt: createAt_Ko,
           updateAt: updatedAt_Ko,
           likes: row.likes,
           nickname: row.User.nickname

        }
    });
   
    return res.status(200).send({message:myLikedPost})
});


//게시글 작성
router.post('/', validToken, async (req, res) => {
    const { title, content } = req.body;

    const userId = res.locals.userId;

    // const findthing = await User.findOne({
    //     attributes: ['nickname'],
    //     where: {
    //         nickname: nickname,
    //     },
    // });
    // const { userId } = JSON.parse(JSON.stringify(findthing));

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
    const existPost = await Posts.findAll({
        where: { postId: postId }
    });
    if (!existPost.length) {
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
    const userId = res.locals.userId;
    const { postId } = req.params;
    const { title, content } = req.body;
    const existPost = await Posts.findAll({
        where: { postId: postId },
        include: [{
            model: User,
            attributes: ['nickname'],
            where: { userId: userId }
        }],

    });
    //console.log("11111",excistPost)
    if (!existPost.length) {
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
    const userId = res.locals.userId;

    const existPost = await Posts.findAll({
        where: { postId: postId },

        include: [{
            model: User,
            where: { userId: userId }
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


//게시글 좋아요
router.put('/:postId/like', validToken, async (req, res) => {
    const { postId } = req.params;
    const userId = res.locals.userId
    const existPost = await Posts.findByPk(postId);
    if (!existPost) {
        return res.status(404).send({ message: "그 번호의 게시글은 없습니다" })
    }
    const existLike = await Like.findAll({
        where: { 
            [Op.and]: [{ userId: userId }, { postId: postId }] 
        }
    });
    if (!existLike.length) {
        //없으면 create하고 
        Like.create({
            userId: userId,
            postId: postId
        })
        res.send({message: ` ${userId}번 유저 좋아요 등록`});
    }else{
        //있으면 삭제사고
        Like.destroy({
            where: { 
                [Op.and]: [{ userId: userId }, { postId: postId }] 
            }
        });
        res.send({message: ` ${userId}번 유저 좋아요취소`});
    }

    
});




module.exports = router;
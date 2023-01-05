const express = require('express');
const router = express.Router();
const { User } = require('../models/index.js');
const { refToken } = require('../models/index.js');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const cookieParser = require('cookie-parser');
const SECRET_KEY = '이큐브랩 수석개발자';

router.use(cookieParser());

router.get('/', (req, res) => {
    res.send('login page');
});

router.post('/', async (req, res) => {
    const { nickname, password } = req.body;
    const passwordstr = String(password);

    const existUserId = await User.findOne({
        attributes: ['userId'],
        where: {
            password: passwordstr,
            nickname: nickname
        },
    });
    if (!existUserId) {
        return res.status(404).json({ message: "아이디나 패스워드가 틀렸습니다" });
    }
    const { userId } = JSON.parse(JSON.stringify(existUserId));
    const accessToken = jwt.sign(
        { userId: userId },
        SECRET_KEY,
        {
            expiresIn: '10s'
        });

    const refreshToken = jwt.sign(
        {},
        SECRET_KEY,
        {
            expiresIn: '10m'
        });


    await refToken.create({
        refreshToken: refreshToken,
        userId: userId,
    });

    res.cookie('Authorization', `Bearer ${accessToken}`);
    res.cookie('refresh', refreshToken);
    return res.send({ "token": accessToken });
});


module.exports = router;
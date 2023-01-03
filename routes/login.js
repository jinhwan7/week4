const express = require('express');
const router = express.Router();
const { User } = require('../models/index.js');
const { refToken } = require('../models/index.js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const SECRET_KEY = '이큐브랩 수석개발자';

router.use(cookieParser());

router.get('/', (req, res) => {
    res.send('login page');
});

router.post('/', async (req, res) => {
    const { nickname, password } = req.body;

    const users = await User.findOne({
        attributes: ['nickname', 'password'],
        where: {
            nickname: nickname,
            password: password
        },
    });

    if (!users) {
        return res.status(404).json({ message: "아이디나 패스워드가 틀렸습니다" });
    }

    const accessToken = jwt.sign(
        { nickname: nickname },
        SECRET_KEY,
        {
            expiresIn: '10s'
        });

    const refreshToken = jwt.sign(
        {},
        SECRET_KEY,
        {
            expiresIn: '120s'
        });


    await refToken.create({
        refreshToken: refreshToken,
        nickname: nickname,
    });
    
    res.cookie('Authorization', `Bearer ${accessToken}`);
    res.cookie('refresh', refreshToken);
    return res.send({ "token": accessToken });
});


module.exports = router;
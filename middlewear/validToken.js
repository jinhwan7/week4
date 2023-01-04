// middlewares/auth-middleware.js
const SECRET_KEY = '이큐브랩 수석개발자';
const express = require('express');
//const router = express.Router();
const jwt = require("jsonwebtoken");
//const { User } = require("../models/index.js");
const { refToken } = require("../models/index.js");

module.exports = async (req, res, next) => {
    const { Authorization } = req.cookies
    

    const [authType, authToken] = (Authorization || "").split(" ");

    if (!authToken || authType !== "Bearer") {
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
        return;
    }
    const { refresh } = req.cookies;

    try {
        jwt.verify(refresh, SECRET_KEY)
        try {
            const { userId } = jwt.verify(authToken, SECRET_KEY);
            res.locals.userId = userId;
            next();

        } catch (err) {

            let  userId  = await refToken.findOne({
                attributes: ['userId'],
                where: {
                    refreshToken: refresh,
                },
            });
            userId = userId.dataValues.userId
            const accessToken = jwt.sign(
                { "userId": userId },
                SECRET_KEY,
                {
                    expiresIn: '10s'
                });
            res.cookie('Authorization', `Bearer ${accessToken}`);
            console.log('엑세스쿠키재발급')
            res.locals.userId = userId;
            next();
        }
    } catch(err) {
        console.log(err);
        res.status(401).send({
            errorMessage: "다시 로그인해주세요.refresh토큰 만료",
        });
    }

}




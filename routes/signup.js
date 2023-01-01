const express = require('express');
const router = express.Router();
const { User } = require('../models/index.js');

router.post('/',(req,res)=>{
    const { nickname, password, confirm } = req.body;
    console.log(nickname,password,confirm);
    if( String(confirm) !== String(password) ){
        return res.status(400).json({message:"비밀번호가 다릅니다"});
    }else{
        User.create({
            nickname: nickname,
            pasword: password
        });
    }

    res.status(200).send('잘들어옵니다?');
})


module.exports = router;

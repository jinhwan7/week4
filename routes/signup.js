const express = require('express');
const router = express.Router();
const { User } = require('../models/index.js');

/** 
* @brief nickname,password,confirm입력받았은후 형식에 맞나 확인하는 함수
*  @return 잘맞으면 true, 안맞으면 false를 반환합니다.
*  @params nickname,password,confirm순서로 파라미터로 받습니다
*/

router.post('/', async (req, res) => {
    const { nickname, password, confirm } = req.body;

    try {
        const user = await User.findAll({
            attributes: ['nickname'],
            where: { nickname: nickname }
        });
        if (user.length) {
            return res.status(400).json({ message: "동일한 닉네임이 있습니다" })
        }
    } catch {
        return res.status(400).json({ message: " 닉네임을 써주세요" })
    }

    const passwordstr = String(password);

    const reg = /[\W_]/; //\W는 알파벳과 숫자 이외의것과 매칭됨
    if (reg.test(nickname)) {
        return res.status(400).json({ message: "닉네임은 알파벳과 숫자만가능합니다" })
    }
    try {
        if (nickname.length < 3) {
            return res.status(400).json({ message: "닉네임은 최소 3자이상 써주세요" });
        }
    } catch {
        return res.status(400).json({ message: "닉네임을 지우면 안됩니다" })
    }

    if (passwordstr.length < 4) {
        return res.status(400).json({ message: "비밀번호는 4자이상 써주세요" });
    }
    if (passwordstr.includes(nickname)) {
        return res.status(400).json({ message: "닉네임이 같은 비밀번호는 안됩니다" })
    }
    if (String(confirm) !== String(password)) {
        return res.status(400).json({ message: "비밀번호와 confirm이 다릅니다" });
    } else {
        await User.create({
            nickname: nickname,
            password: passwordstr
        });
        res.status(200).json({ message: "회원가입 완료" });
    }
});


module.exports = router;

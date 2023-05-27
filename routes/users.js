const express = require('express');
const router = express.Router();
const { Users, Models } = require('../models');
const jwt = require('jsonwebtoken');
const checkLogin = require('../middlewares/checkLogin.js'); //유저아이디받기
const letter = [
    '.',
    '/',
    '_',
    '+',
    '-',
    '!',
    '~',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '=',
    '?',
    '<',
    '>',
    '"',
    "'",
    '`',
    '|',
];

// ◎  회원가입 API
router.post('/signup', async (req, res) => {
    try {
        const { email, password, nickname } = req.body;

        //닉네임이 중복된 경우
        const existNickname = await Users.findOne({
            where: { nickname },
        });
        if (existNickname) {
            return res
                .status(423)
                .json({ errorMessage: '중복된 닉네임 입니다.' });
        }

        //이메일이 중복된 경우
        const existEmail = await Users.findOne({
            where: { email },
        });
        if (existEmail) {
            return res
                .status(412)
                .json({ errorMessage: '이미 등록된 이메일입니다.' });
        }

        //이메일 형식이 비정상적인 경우
        const existAt = email.split('@');

        //1.이메일 아이디에 특수기호가 있는경우
        let emailletterOk = 0;
        for (let i of letter) {
            if (existAt[0].split(`${i}`).length > 1) {
                emailletterOk = 1;
            }
        }
        if (emailletterOk) {
            return res
                .status(412)
                .json({ errorMessage: '이메일의 형식이 올바르지 않습니다' });
        }

        //2.도메인 형식이 맞지 않는 경우
        const emailDomain = ['naver.com', 'gmail.com', 'hamail.net', 'kakao.com'];
        let emailOk = 0;
        for (let i of emailDomain) {
            if (existAt[1] === i) {
                emailOk = 1;
            }
        }
        if (!emailOk) {
            return res
                .status(412)
                .json({ errorMessage: '이메일의 형식이 올바르지 않습니다' });
        }

        //닉네임 형식이 비정상적인 경우
        ///1. 닉네임에 특수문자가 있는 경우
        let nicknameletterOk = 0;
        for (let i of letter) {
            if (nickname.split(`${i}`).length > 1) {
                nicknameletterOk = 1;
            }
        }
        if (nicknameletterOk) {
            return res
                .status(412)
                .json({ errorMessage: '닉네임의 형식이 올바르지 않습니다' });
        }
        ///2.닉네임이 숫자로만 되어있는 경우
        if (nickname * 1) {
            return res
                .status(412)
                .json({ errorMessage: '닉네임의 형식이 올바르지 않습니다' });
        }

        //password 형식이 비정상적인 경우
        ///1. password에 특수문자가 한개 이상 포함되지 않은 경우
        let passwordletterOk = 0;
        for (let i of letter) {
            if (password.split(`${i}`).length > 1) {
                passwordletterOk = 1;
            }
        }
        if (!passwordletterOk) {
            return res.status(412).json({
                errorMessage:
                    '1개 이상의 특수문자를 사용하여 password를 설정해야 합니다.',
            });
        }

        //password에 닉네임이 포함되어있는 경우
        if (password.split(`${nickname}`).length > 1) {
            return res.status(412).json({
                errorMessage: 'password에 nickname포함되어서는 안됩니다.',
            });
        }

        //회원가입
        const credit = 10; //처음 제공되는 기본 크레딧 값
        const newUser = await Users.create({
            email,
            password,
            nickname,
            credit,
        });
        return res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
        return res
            .status(500)
            .json({ errorMessage: '예상하지 못한 서버 문제가 발생했습니다.' });
    }
});

// ◎  로그인 API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginUser = await Users.findOne({
            where: { email },
        });

        //디비에 저장된 이메일이 없거나 패스워드가 틀린 경우
        if (!loginUser || password !== loginUser.password) {
            return res
                .status(412)
                .json({ errorMessage: '이메일 또는 패스워드를 확인해주세요.' });
        }

        //토큰 보내주기
        const token = jwt.sign({ userId: loginUser.userId }, 'chatGPT_key');
        res.cookie('Authorization', `Bearer ${token}`);
        return res
            .status(200)
            .json({ token: `Bearer ${token}`, message: '로그인 성공' });
    } catch (error) {
        return res
            .status(500)
            .json({ errorMessage: '예상하지 못한 서버 문제가 발생했습니다.' });
    }
});

// ◎  로그아웃 API
router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('Authorization');
        //res.redirect('/api');
        return res.status(200).json({ message: '로그아웃 성공' });
    } catch {
        return res
            .status(500)
            .json({ errorMessage: '예상하지 못한 서버 문제가 발생했습니다.' });
    }
});

// ◎  credit 확인 API
router.get('/credit', checkLogin, async (req, res) => {
    try {
        const { userId } = res.locals.user;

        const mycredit = await Users.findOne({
            attributes: ['credit'],
            where: { userId },
        });
        return res.status(200).json({ mycredit: mycredit.credit });
    } catch {
        return res
            .status(500)
            .json({ errorMessage: '크레딧 조회에 실패했습니다' });
    }
});

module.exports = router;

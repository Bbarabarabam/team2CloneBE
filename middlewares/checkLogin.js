const jwt = require('jsonwebtoken');
const { Users } = require('../models');

module.exports = async (req, res, next) => {
    try {
        const { Authorization } = req.cookies;

        //토큰이 있는지 확인
        if (!Authorization) {
            return res
                .status(403)
                .json({ errorMessage: '로그인이 필요한 서비스입니다.' });
        }

        const [authType, authToken] = Authorization.split(' ');

        //authTyep === Bearer인지 확인
        if (authType !== 'Bearer' || !authToken) {
            return res.status(403).json({ errorMessage: '토큰 정보 오류' });
        }

        //
        const { userId } = jwt.verify(authToken, 'chatGPT_key');
        const user = await Users.findOne({ where: { userId } });

        res.locals.user = user;
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ errorMessage: '로그인이 필요한 서비스입니다.' });
    }
};

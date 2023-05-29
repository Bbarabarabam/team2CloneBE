const env = require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

const indexRouter = require('./routes/index.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', [indexRouter]);

// CORS 설정
const cors = require('cors');
app.use(
    cors({
        origin: ['https://team2-clone-fe.vercel.app'],
        credentials: true,
    })
);

app.get('/', (req, res) => {
    res.status(200).send('chatGPT clone API');
});

app.listen(3001, () => {
    console.log('3001 포트로 서버 연결');
});

// ❖ 24시간마다 모든유저 크레딧 10개로 갱신
const intervalID = setInterval(myCallback, 86400000);

async function myCallback() {
    await Users.update({ credit: 10 }, { where: {} });
}

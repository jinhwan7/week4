const express = require('express');
const app = express();
const port = 3001;
const { sequelize } = require('./models/index.js');

const indexRouter = require('./routes/index.js');

sequelize.sync({ force: false})
.then(() => {
    console.error('데이터베이스연결성공');
})
.catch((err)=> {
    console.log(err);
});


app.use(express.json());


app.get('/',(req,res)=>{
    res.send('메인페이지');
});

app.use('/',indexRouter);


app.listen(port, ()=>{
    console.log(port,"포트로 잘 연결되었습니다");
})
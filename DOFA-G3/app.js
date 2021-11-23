'use strict';

const express = require("express");
const app = express();
const fs = require("fs");
const PORT = 5000;

// 정적 파일 불러오기
app.use(express.static(__dirname + "/view"));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get("", (req, res) => {
    fs.readFile(__dirname + '/_tmp/gitlogg.json', 'utf8', function (err, data){
        const json = JSON.parse(data);
        res.render(__dirname+'/view/css-table-14/log.ejs', {json});
    });
});
//
// app.get('/', (req, res) => {
//   res.render(__dirname + '/view/css-table-14/index.html');
// });

// 서버 실행
app.listen(PORT, () => {
    console.log(`Listen : ${PORT}`);
});
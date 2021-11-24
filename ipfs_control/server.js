var express = require('express');
var http = require('http');
var serveStatic = require('serve-static');      //특정 폴더의 파일들을 특정 패스로 접근할 수 있도록 열어주는 역할
var path = require('path');
 
var app = express();      //express 서버 객체
 
var bodyParser_post = require('body-parser');       //post 방식 파서
 
app.set('port', 3000);
 
 
//미들웨어들 등록 시작, 아래 미들웨어들은 내부적으로 next() 가실행됨
 
//join은 __dirname : 현재 .js 파일의 path 와 public 을 합친다
//이렇게 경로를 세팅하면 public 폴더 안에 있는것을 곧바로 쓸 수 있게된다
app.use(serveStatic(path.join(__dirname, 'public')));
 
 
//post 방식 일경우 begin
//post 의 방식은 url 에 추가하는 방식이 아니고 body 라는 곳에 추가하여 전송하는 방식
app.use(bodyParser_post.urlencoded({ extended:false }));            // post 방식 세팅
app.use(bodyParser_post.json());                                     // json 사용 하는 경우의 세팅
//post 방식 일경우 end
 
 
//이건 사용자 정의형태로 미들웨어를 제작
app.use(
    function (req, res, next) {
        console.log(req.body.submit1);
        console.log('middle wared was called : first');
        //res.redirect('http://google.co.kr');
 
        //req 여러 정보를 얻어 올 수 있는데 그중
        //요청받은 request 정보중에서 User-Agent 정볼를 따로 분리하여 갖어올 수 있다
        var userAgent = req.header('User-Agent');
 
        //요청파라미터는 get 방식인 req.query 에 들어오게 된다
        //post 방식은 body로 들어오게된다
        //name 은 정해져있는 명칭
 
        //var paramName = req.body.id || req.query.id;
        //var paramNamePW = req.body.passwords || req.query.passwords;
 
        //응답 보내기
        //res.send('<h3>response from server!!7!! : ' + userAgent + '[' + paramName + ' : ' + paramNamePW  + '] </h3>');

        //console.log(__dirname);
        

        //실행 완료를 기다리는 exec
        const exec = require('child_process').exec;

        function os_func() {
            this.execCommand = function(cmd, callback) {
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }

                    callback(stdout);
                });
            }
        }
        var os = new os_func();

        //실행 완료를 기다리는 exec 끝

        
        if(req.body.submit1 == "PUSH TO P2P"){
            os.execCommand('ipfs add -r -w -H data/project1 > pushLog.txt', function (returnvalue) {

                var fs = require('fs');
                var data = fs.readFileSync('pushLog.txt','utf8');
                //console.log("data : "+data); // data == 폴더 하위 해시코드 목록
                data = data.split(' ');
                var folderHash = data[data.length-2]; // 최상위 폴더 해쉬
                console.log(folderHash);

                os.execCommand('ipfs name publish --key=projectKey '+folderHash + ' > nameHash.txt' , function (returnvalue) {

                    var fs = require('fs');
                    var data = fs.readFileSync('nameHash.txt','utf8');

                    res.redirect('/');
                    var msg = require ('dialog');
                    data = data.split(" ");
                    data = data[data.length - 2];
                    data = data.split(":");
                    msg.info("Upload complete. Your project name: " + data[0]);
                });

                var msg = require ('dialog');
                msg.info("Please wait. Pushing takes time......");
            });

        }
        
        if(req.body.submit1 == "PULL FROM P2P"){
            /*name 로그에서 가져오기 추가*/
            var fs = require('fs');
            var data = fs.readFileSync('nameHash.txt','utf8');
            data = data.split(" ");
            data = data[data.length - 2];
            data = data.split(":");
            console.log("project name hash: " + data[0]);
            os.execCommand('ipfs name resolve ' + data[0] + ' > pullLog.txt', function (returnvalue) {
                var fs = require('fs');
                var data = fs.readFileSync('pullLog.txt','utf8');
                console.log("data : "+data); // data == 폴더의 ipfs 해시 코드

                var path = "data " ; //경로 설정을 원한다면 여기 작성
                os.execCommand('ipfs get -o=./' + path + data, function (returnvalue) {
                    res.redirect('/');
                    var msg = require ('dialog');
                    msg.info("Download complete");
                });
                /* test  폴더 하위로 저장되는거 지우기 */
            });

        }
        
    }
);
 
 
//웹서버를 app 기반으로 생성
var appServer = http.createServer(app);
appServer.listen(app.get('port'),
    function () {
        console.log('express 웹서버 실행' + app.get('port'));
        console.log('http://localhost:' + app.get('port') + '/');
    }
);


//server.js
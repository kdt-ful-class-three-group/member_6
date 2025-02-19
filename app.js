import http from 'http';
import fs from 'fs';
import qs from 'querystring'; // 쿼리스트링 라이브러리 추가
import loginData from './loginData.js';

const server = http.createServer(function(req, res) {
  if(req.method === "GET") {
    if(req.url === "/") {
      const indexPage = fs.readFileSync('index.html', 'utf-8');
      res.writeHead( 200, { "Content-Type": "text/html; charset=utf-8" } );
      res.write(indexPage);
      res.end();
    } else if(req.url === "/join") {
      const joinPage = fs.readFileSync('join.html', 'utf-8');
      res.writeHead( 200, { "Content-Type": "text/html; charset=utf-8" } );
      res.write(joinPage);
      res.end();
    } else if(req.url === "/list") {
      res.writeHead( 200, { "Content-Type": "text/html; charset=utf-8" } );
      let listData = "";
      loginData.forEach(function(users) {
        listData += `<p>이름 : ${users.name}</p>
        <p>비밀번호 : ${users.password}</p>`
      });
      const listPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>조회화면</title>
</head>
<body>
  <h1>현재 로그인 가능한 유저 목록</h1>
  ${listData}
  <button type="button" onclick="location.href='/'">홈으로</button>
</body>
</html>`;
      res.write(listPage);
      res.end();
    }
  }
  if(req.method === "POST") {
    if(req.url === "/login") {
      let body = "";
      let dataObj;
      req.on("data", function(data) {
        body += data;
        dataObj = qs.parse(body);
      });
      req.on("end", function() {
        let name = dataObj.name;
        let password = dataObj.password;
        let loginFlg = false;
        loginData.forEach(function(users) {
          if(users.name == name && users.password == password) {
            loginFlg = true;
            return loginFlg;
          }
        });
        if(loginFlg === true) {
          // const resultPage = fs.readFileSync('result.html', 'utf-8');
          res.writeHead( 200, { "Content-Type": "text/html; charset=utf-8" } );
          res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>로그인 결과 화면</title>
</head>
<body>
  <h1>post 반응하고 왔어!</h1>
  <p>이름 : ${name}</p>
  <p>비밀번호 : ${password}</p>
  <p>로그인 성공했어!</p>
  <button type="button" onclick="location.href='/'">홈으로</button>
</body>
</html>`);
        } else {
          res.writeHead(404);
      res.end(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로그인 결과 화면</title>
  </head>
  <body>
    <h1>post 반응하고 왔어!</h1>
    <p>로그인 실패했어 ㅠㅠ</p>
    <button type="button" onclick="location.href='/'">홈으로</button>
  </body>
  </html>`);
        }
      });
    } else if (req.url === "/join") {
      let body = "";
      let dataObj;
      req.on("data", function(data) {
        body += data;
        dataObj = qs.parse(body);
      });
      req.on("end", function() {
        let name = dataObj.name;
        let password = dataObj.password;
        let joinFlg = true;
        loginData.forEach(function(users) {
          if(users.name === name) {
            joinFlg = false;
            return joinFlg;
          }
        });
        if(joinFlg === true) {
          // const resultPage = fs.readFileSync('result.html', 'utf-8');
          loginData.push(dataObj);
          res.writeHead( 200, { "Content-Type": "text/html; charset=utf-8" } );
          res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>회원가입 결과 화면</title>
</head>
<body>
  <h1>회원가입완료!</h1>
  <p>이름 : ${name}</p>
  <p>비밀번호 : ${password}</p>
  <button type="button" onclick="location.href='/'">홈으로</button>
</body>
</html>`);
        } else {
          res.writeHead(404);
      res.end(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원가입 결과 화면</title>
  </head>
  <body>
    <p>회원가입 실패 ㅠㅠ</p>
    <button type="button" onclick="location.href='/'">홈으로</button>
  </body>
  </html>`);
        }
      });
    } else {
      res.writeHead(404);
      res.end(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>잘못된 접근</title>
  </head>
  <body>
    <h1>잘못된 페이지야!</h1>
    <button type="button" onclick="location.href='/'">홈으로</button>
  </body>
  </html>`);
    }
  }
});

server.listen(3000, function() {
  console.log('http://localhost:3000/ 서버 기동중 입니다.');
});
import http from 'http';
import fs from 'fs';
import qs from 'querystring'; // 쿼리스트링 라이브러리 추가
import url from 'url';
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
        <p>비밀번호 : ${users.password}</p>
        <button type="button" onclick="location.href='/update?name=${users.name}'">변경하기</button>`
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
  <br>
  <button type="button" onclick="location.href='/'">홈으로</button>
</body>
</html>`;
      res.write(listPage);
      res.end();
    } else if(req.url.startsWith("/update")) {
      const urlParams = url.parse(req.url);
      let updateUser = qs.parse(urlParams.query);
      console.log(updateUser.name);
      const updatePage = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>마이페이지</title>
</head>
<body>
  <h1>정보 변경하기</h1>
  <form action="/update" method="post">
    <input type="hidden" name="hiddenName" value=${updateUser.name}>
    <input type="text" name="name" placeholder="이름을 입력하세요.">
    <input type="password" name="password" placeholder="비밀번호를 입력하세요.">
    <button type="submit">변경</button>
  </form>
</body>
</html>
      `;
      res.writeHead( 200, { "Content-Type": "text/html; charset=utf-8" } );
      res.write(updatePage);
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
          if(users.name === name || name === "" || password === "") {
            joinFlg = false;
            return joinFlg;
          }
        });
        if(joinFlg === true) {
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
    } else if(req.url === "/update") {
      let body = "";
      let dataObj;
      req.on("data", function(data) {
        body += data;
        dataObj = qs.parse(body);
      });
      req.on("end", function() {
        let name = dataObj.name;
        let password = dataObj.password;
        let updateName = dataObj.hiddenName;
        let updateFlg = true;
        loginData.forEach(function(users) {
          if(name === "" || password === "") {
            updateFlg = false;
            return updateFlg;
          }
        });
        if(updateFlg === true) {
          const testData = loginData.map(obj => {
            return obj.name === updateName ? {name: name, password: password} : obj
          });
          console.log(testData);
          console.log("--------------");
          console.log(loginData);
          loginData.splice(0, loginData.length);
          console.log(loginData);
          loginData.push(testData); // ! 수정해야함
          res.writeHead( 200, { "Content-Type": "text/html; charset=utf-8" } );
          res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>정보변경 결과 화면</title>
</head>
<body>
  <h1>정보변경완료!</h1>
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
    <title>정보변경 결과 화면</title>
  </head>
  <body>
    <p>정보변경 실패 ㅠㅠ</p>
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
import http from 'http';
import fs from 'fs';
import qs from 'querystring'; // 쿼리스트링 라이브러리 추가

const server = http.createServer(function(req, res) {
  if(req.method === "GET") {
    if(req.url === "/") {
      const indexPage = fs.readFileSync('index.html', 'utf-8');
      res.writeHead( 200, { "Content-Type": "text/html; charset=utf-8" } );
      res.write(indexPage);
      res.end();
    }
  }
  if(req.method === "POST") {
    if(req.url === "/form") {
      req.on("data", function(data) {
        console.log(qs.parse(data.toString())); // 문자열을 JSON Obj형식으로 변환
      });
      const resultPage = fs.readFileSync('result.html', 'utf-8');
      res.writeHead( 200, { "Content-Type": "text/html; charset=utf-8" } );
      res.write(resultPage);
      res.end();
    }
  }
});

server.listen(3000, function() {
  console.log('http://localhost:3000/ 서버 기동중 입니다.');
});
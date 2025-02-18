import http from 'http';
import fs from 'fs';

const server = http.createServer(function(req, res) {
  if(req.method === "GET") {
    if(req.url === "/") {
      const indexPage = fs.readFileSync('index.html', 'utf-8');
      res.writeHead( 200, { "Content-Type": "text/html; charset=utf-8" } );
      res.write(indexPage);
      res.end();
    }
  }
});

server.listen(3000, function() {
  console.log('http://localhost:3000/ 서버 기동중 입니다.');
});
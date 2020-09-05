const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  if (req.method === 'DELETE') {
    const pathname = url.parse(req.url).pathname.slice(1);
    const filepath = path.join(__dirname, 'files', pathname);
    if (pathname.includes("/")) {
      res.statusCode = 400;
      res.end(JSON.stringify({error: 'Bad Request'}));
    } else if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
        res.statusCode = 200;
        res.end('File successfully removed');
      } catch {
        res.statusCode = 500;
        res.end(JSON.stringify({error: 'Internal server error'}))
      }
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({error: 'Not found'}))
    }
  } else {
    res.statusCode = 501;
    res.end(JSON.stringify({error: 'Not implemented'}));
  }
});

module.exports = server;

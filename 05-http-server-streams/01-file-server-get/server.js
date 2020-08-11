const url = require('url');
const http = require('http');
const path = require('path');
const fs =  require('fs');

const server = new http.Server();

const handleError = res => err => {
  const file_not_found_error = err.code  === 'ENOENT';
  res.statusCode = file_not_found_error ? 404 : 500;
  res.end(JSON.stringify({error: file_not_found_error ? 'Not found' : 'Internal Server Error'}))
}

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.includes("/")) {
    res.statusCode = 400;
    res.end(JSON.stringify({error: 'Bad Request'}));
  } else  {
    const filepath = path.join(__dirname, './test/fixtures', pathname);
    fs.createReadStream(filepath).on("error", handleError(res)).pipe(res).on("error", handleError(res));
  }
});

module.exports = server;

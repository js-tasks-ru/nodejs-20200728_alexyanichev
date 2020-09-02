const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('../../03-streams/01-limit-size-stream/LimitSizeStream');
const LimitExceededError = require('../../03-streams/01-limit-size-stream/LimitExceededError');

const server = new http.Server();

const removeFileSafely = filepath => {
  try {
    fs.unlinkSync(filepath)
  } catch {
   //ignore
  }
}

const handleError = (res, filepath) => err => {
  removeFileSafely(filepath)
  const limit_exceeded = err instanceof LimitExceededError;
  res.statusCode = limit_exceeded ? 413 : 500;
  res.end(JSON.stringify({error: limit_exceeded ? 'Payload Too Large' : 'Internal Server Error'}))
};

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filesFolder = path.resolve(__dirname, './files');
  const filepath = path.join(filesFolder, pathname);

  if (pathname.includes("/")) {
    res.statusCode = 400;
    res.end(JSON.stringify({error: 'Bad Request'}));
  } else if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end(JSON.stringify({error: 'File already exists'}));
  } else {
    const limitStream = new LimitSizeStream({limit: 1048576, encoding: 'utf-8'});
    const writeStream = fs.createWriteStream(filepath);
    req.on('error', handleError(res, filepath))
      .pipe(limitStream).on('error', handleError(res, filepath))
      .pipe(writeStream).on('error', handleError(res, filepath));

    req.on('end', () => {
      res.statusCode = 201;
      res.end("File successfully saved");
    })

    res.on('close', () => {
      if (!res.finished ) {
        writeStream.destroy();
        removeFileSafely(filepath)
      }
    })
  }
});

module.exports = server;

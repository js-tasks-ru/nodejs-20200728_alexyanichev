const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    const chunk_size = Buffer.byteLength(chunk, encoding);
    if (chunk_size > this.limit)  {
      callback(new LimitExceededError());
    } else {
      this.limit -= chunk_size;
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;

const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.data = "";
  }

  _transform(chunk, encoding, callback) {
    this.data += chunk;
    callback()
  }

  _flush(callback) {
    const data_array = this.data.split(os.EOL);
    for (const item of data_array) {
      this.push(item)
    }
    callback()
  }
}

module.exports = LineSplitStream;

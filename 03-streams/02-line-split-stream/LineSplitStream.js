const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.remainder = "";
  }

  _transform(chunk, encoding, callback) {
    const data = (this.remainder + chunk).split(os.EOL);
    if (data.length > 1) {
      this.remainder = data.splice(data.length - 1)[0];
      for (const item of data) {
        this.push(item);
      }
    } else {
      this.remainder = data[0];
    }
    callback();
  }

  _flush(callback) {
    if (this.remainder) {
      this.push(this.remainder)
    }
    callback()
  }
}

module.exports = LineSplitStream;
const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');
const User = require('./models/User');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    try {
      const token = socket.handshake.query.token;
      if (!token) {
        next(new Error("anonymous sessions are not allowed"))
      } else {
        const session = await Session.findOne({token});
        if (!session) {
          next(new Error("wrong or expired session token"))
        } else {

          socket.user = session.user;
          next();
        }
      }
    } catch (error) {
      next(error)
    }

  });

  io.on('connection', function(socket) {
    try {
      socket.on('message', async msg => {
        const user_id = socket.user;
        const {displayName} = await User.findOne(user_id);
        await Message.create({user: displayName, chat: user_id, text: msg, date: new Date()});
      });
    } catch (error) {
      next(error)
    }
  });

  return io;
}

module.exports = socket;

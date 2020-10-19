const Message = require('../models/Message');
const {getErrorMessagesByKeys} = require('../../../09-email/01-registration/controllers/registration');

const messagesMapper = (messages = []) => messages.map(({ date, text, _id, user }) => ({
  date,
  text,
  id: _id,
  user
}));

module.exports.messageList = async function messages(ctx, next) {
  try {
    const messages = await Message.find({user: ctx.user.displayName}).sort({date: -1}).limit(20);
    ctx.body = {messages: messagesMapper(messages)};
  }
  catch (error) {
    ctx.status = 400;
    ctx.body = { errors: getErrorMessagesByKeys(error) }
  }
};

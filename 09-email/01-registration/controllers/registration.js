const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

function getErrorMessagesByKeys(error) {
  const errors = error.errors;
  const error_keys = Object.keys(error.errors);
  const error_messages_by_keys = {};
  for( let error_key of error_keys ) {
    const message = errors[error_key].properties && errors[error_key].properties.message || "Неизвестная ошибка"
    error_messages_by_keys[error_key] = message;
  }
  return error_messages_by_keys;
}

module.exports.register = async (ctx, next) => {
  try {
    const {email, password, displayName} = ctx.request.body;

    const verificationToken = uuid();
    const user = new User({email, displayName, verificationToken});
    await user.setPassword(password);
    await user.save();
    await sendMail({to: email, subject: "Email confirmation",
                           template: "confirmation", locals: {token: verificationToken}});

    ctx.status = 200;
    ctx.body = {status: 'ok'};
  } catch (error) {
    if (error.errors) {
      ctx.status = 400;
      ctx.body = { errors: getErrorMessagesByKeys(error) };
    } else {
      ctx.status = 500;
      ctx.body = { error: "Неизвестная ошибка" };
    }
  }
};

module.exports.confirm = async (ctx, next) => {
  try {
    const {verificationToken} = ctx.request.body;
    const user = await User.findOne({verificationToken});

    if (user) {
      user.verificationToken = undefined;
      await user.save();
      ctx.status = 200;
      ctx.body = {token: verificationToken};
    } else {
      ctx.status = 400;
      ctx.body = { error: "Ссылка подтверждения недействительна или устарела" };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Неизвестная ошибка" };
  }
};

module.exports.getErrorMessagesByKeys = getErrorMessagesByKeys;
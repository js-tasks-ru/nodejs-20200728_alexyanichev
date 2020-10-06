module.exports = function mustBeAuthenticated(ctx, next) {
  if (ctx.user) {
    return next();
  } else {
    ctx.status = 401;
    ctx.body = {error: 'Пользователь не залогинен'}
  }
};

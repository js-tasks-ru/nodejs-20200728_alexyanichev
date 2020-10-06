const Session = require('../models/Session');
const passport = require('../libs/passport');

module.exports.login = async function login(ctx, next) {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err;


    try {
      if (!user) {
        ctx.status = 400;
        ctx.body = {error: info};
        return;
      }

      const token = await ctx.login(user);

      ctx.body = {token};

      const session = await new Session({token, user: user._id, lastVisit: new Date()});
      await session.save();
    } catch (error) {
      throw error;
    }



  })(ctx, next);
};

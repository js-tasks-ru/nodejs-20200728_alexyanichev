const User = require("../../models/User")

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (email) {
    const user = await User.findOne({email});

    if (user) {
      done(null, user, "");
    } else {
      try {
        const new_user = await new User({email, displayName});
        await new_user.save();
        done(null, new_user, "");
      } catch (e) {
        done(e, false, "");
      }
    }
  } else {
    done(null, false, 'Не указан email');
  }
};

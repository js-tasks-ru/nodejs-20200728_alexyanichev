const User = require("../../models/User")

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (email) {
      const user = await User.findOne({email});

      if (user) {
        done(null, user, "");
      } else {
        const new_user = await new User({email, displayName});
        await new_user.save();
        done(null, new_user, "");
      }
    } else {
      done(null, false, 'Не указан email');
    }
  } catch (error) {
    done(error, false, '');
  }
};

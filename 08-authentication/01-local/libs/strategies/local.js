const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      try {
        const user = await User.findOne({ email });

        if (user) {
          const password_is_correct = await user.checkPassword(password);
          password_is_correct ?
            done(null, user, ''):
            done(null, false, 'Неверный пароль');
        } else {
          done(null, false, 'Нет такого пользователя');
        }
      } catch (error) {
        done(error, false, '');
      }
    },
);

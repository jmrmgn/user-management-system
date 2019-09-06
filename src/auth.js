const { SESSION_NAME } = process.env;
const {
  AuthenticationError,
  UserInputError
} = require('apollo-server-express');
const { compare } = require('bcryptjs');

const { User } = require('./models');

module.exports = {
  attemptSignIn: async (username, password) => {
    const errorMsg = 'Invalid username or password';
    const user = await User.findOne({ username });

    if (!user) throw new UserInputError(errorMsg);
    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new UserInputError(errorMsg);

    return user;
  },
  checkSignedIn: req => {
    if (!req.session.userId) {
      throw new AuthenticationError('You must be signed in');
    }
  },
  checkSignedOut: req => {
    if (req.session.userId) {
      throw new AuthenticationError('You must be signed out');
    }
  },
  signOut: (req, res) =>
    new Promise((resolve, reject) => {
      req.session.destroy(err => {
        if (err) reject(err);

        res.clearCookie(SESSION_NAME);
        resolve(true);
      });
    })
};

const { SECRET_KEY } = process.env;
const { UserInputError } = require('apollo-server-express');
const { compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('./models');

const attemptSignIn = async (username, password) => {
  const errorMsg = 'Invalid username or password';
  const user = await User.findOne({ username });

  if (!user) throw new UserInputError(errorMsg);
  const isMatch = await compare(password, user.password);
  if (!isMatch) throw new UserInputError(errorMsg);

  return user;
};

const getUser = token => {
  try {
    if (token) return jwt.verify(token, SECRET_KEY);
    return null;
  } catch (err) {
    return null;
  }
};

const tokenSigning = async payload => {
  const token = await jwt.sign(payload, SECRET_KEY, { expiresIn: 3600 });
  return token;
};

module.exports = {
  attemptSignIn,
  tokenSigning,
  getUser
};

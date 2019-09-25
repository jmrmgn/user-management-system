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

const getUser = req => {
  try {
    const tokenWithBearer = req.headers.authorization || '';
    const token = tokenWithBearer.split(' ')[1];

    if (token) return jwt.verify(token, SECRET_KEY);
    return null;
  } catch (err) {
    return null;
  }
};

const tokenSigning = async (payload, isRefreshToken) => {
  const expiresIn = isRefreshToken ? '7d' : '30s';
  const token = await jwt.sign(payload, SECRET_KEY, { expiresIn });
  return token;
};

const sendRefreshToken = (res, token, isDestroy) => {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    ...(isDestroy ? { expires: new Date(Date.now()) } : false)
  });
};

module.exports = {
  attemptSignIn,
  tokenSigning,
  sendRefreshToken,
  getUser
};

const { UserInputError } = require('apollo-server-express');
const { isValid } = require('mongoose').Types.ObjectId;
const Auth = require('../../auth');

const { User } = require('../../models');

const Query = {
  // TODO: Validation
  me: async (root, args, { req }, info) => {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    return user;
  },
  users: async (root, args, { req }, info) => {
    const users = await User.find({});
    return users;
  },
  user: async (root, args, { req }, info) => {
    const { id } = args;
    if (!isValid(id)) throw new UserInputError(`${id} is not a valid User ID`);
    const user = await User.findById(id);
    return user;
  },
  login: async (root, { username, password }, { req }, info) => {
    const user = await Auth.attemptSignIn(username, password);
    req.session.userId = user._id;
    return user;
  }
};

const Mutation = {
  // TODO: Validation
  signUp: async (root, args, { req }, info) => {
    const { username } = args;
    const user = await User.findOne({ username });
    if (user) throw new UserInputError(`${username} is already taken.`);

    const newUser = await User.create(args);
    req.session.userId = newUser._id;

    return newUser;
  },
  signOut: (root, args, { req, res }, info) => {
    return Auth.signOut(req, res);
  }
};

module.exports = {
  Query,
  Mutation
};

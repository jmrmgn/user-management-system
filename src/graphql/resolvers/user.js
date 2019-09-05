const { UserInputError } = require('apollo-server-express');
const { isValid } = require('mongoose').Types.ObjectId;
const { compare } = require('bcryptjs');

const { User } = require('../../models');

const Query = {
  // TODO: Validation, Session
  async users(root, args, context, info) {
    const users = await User.find({});
    return users;
  },
  async user(root, args, context, info) {
    const { id } = args;
    if (!isValid(id)) throw new UserInputError(`${id} is not a valid User ID`);
    const user = await User.findById(id);
    return user;
  },
  async login(root, { username, password }, context, info) {
    const errorMsg = 'Invalid username or password';
    const user = await User.findOne({ username });

    if (!user) throw new UserInputError(errorMsg);
    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new UserInputError(errorMsg);

    return user;
  }
};

const Mutation = {
  // TODO: Validation, Session
  async signUp(root, args, context, info) {
    const { username } = args;
    const user = await User.findOne({ username });

    if (user) throw new UserInputError(`${username} is already taken.`);

    return User.create(args);
  }
};

module.exports = {
  Query,
  Mutation
};

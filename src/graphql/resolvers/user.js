const { UserInputError } = require('apollo-server-express');
const { isValid } = require('mongoose').Types.ObjectId;
const Auth = require('../../auth');

const { User } = require('../../models');

const Query = {
  // TODO: Validation, Session
  async users(root, args, { req }, info) {
    Auth.checkSignedIn(req);

    const users = await User.find({});
    return users;
  },
  async user(root, args, { req }, info) {
    Auth.checkSignedIn(req);

    const { id } = args;
    if (!isValid(id)) throw new UserInputError(`${id} is not a valid User ID`);
    const user = await User.findById(id);
    return user;
  },
  async login(root, { username, password }, { req }, info) {
    Auth.checkSignedOut(req);
    const user = await Auth.attemptSignIn(username, password);
    req.session.userId = user._id;
    return user;
  }
};

const Mutation = {
  // TODO: Validation, Session
  async signUp(root, args, { req }, info) {
    Auth.checkSignedOut(req);

    const { username } = args;
    const user = await User.findOne({ username });
    if (user) throw new UserInputError(`${username} is already taken.`);

    const newUser = await User.create(args);
    req.session.userId = newUser._id;

    return newUser;
  },
  signOut(root, args, { req, res }, info) {
    Auth.checkSignedIn(req);
    return Auth.signOut(req, res);
  }
};

module.exports = {
  Query,
  Mutation
};

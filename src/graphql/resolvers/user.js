const { UserInputError } = require('apollo-server-express');

const { isValidId } = require('../../helpers/strings');
const Auth = require('../../auth');
const { User } = require('../../models');

module.exports = {
  Query: {
    // TODO: Validation
    me: async (root, args, { req, user }, info) => {
      const userId = user.id;
      const currentUser = await User.findById(userId);
      return currentUser;
    },
    users: async (root, args, { req }, info) => {
      const users = await User.find({});
      return users;
    },
    user: async (root, args, { req }, info) => {
      const { id } = args;
      // TODO: Transfer in Joi Validation
      isValidId(id);
      const user = await User.findById(id);
      return user;
    }
  },
  Mutation: {
    // TODO: Validation
    login: async (root, { username, password }, { req, res }, info) => {
      const user = await Auth.attemptSignIn(username, password);

      const { _id, name } = user;
      const payload = { id: _id, name };
      const token = await Auth.tokenSigning(payload);
      const refreshToken = await Auth.tokenSigning(payload, true);

      Auth.sendRefreshToken(res, refreshToken);

      return { token, user };
    },
    signUp: async (root, args, { req }, info) => {
      const { username } = args;
      const user = await User.findOne({ username });
      if (user) throw new UserInputError(`${username} is already taken.`);

      const newUser = await User.create(args);
      const token = await Auth.tokenSigning({
        id: newUser._id,
        name: newUser.name
      });

      return { token, user: newUser };
    },
    logout: (root, args, { _, res }, info) => {
      Auth.sendRefreshToken(res, '', true);

      return true;
    }
  }
};

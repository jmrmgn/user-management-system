const { UserInputError } = require('apollo-server-express');
const { User } = require('../../models');

const Query = {
  users: (root, args, context, info) => {}
};

const Mutation = {
  // TODO: Validation, Session
  signUp: async (root, args, context, info) => {
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

const { UserInputError } = require('apollo-server-express');
const { isValidId } = require('../../helpers/strings');
const Auth = require('../../auth');
const { User } = require('../../models');

const checkAddToFriends = async (userId, id) => {
  // TODO: Transfer in Joi Validation
  isValidId(id);
  const user = await User.findById(userId);
  const userToAdd = await User.findById(id);
  if (!userToAdd) throw new UserInputError('User not found');
  const friendList = user.friends;
  const isInFriends =
    friendList.filter(entry => String(entry) === String(id)).length > 0;

  return {
    user,
    isInFriends
  };
};

module.exports = {
  Query: {
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
      // TODO: Transfer in Joi Validation
      isValidId(id);
      const user = await User.findById(id);
      return user;
    },
    login: async (root, { username, password }, { req }, info) => {
      const user = await Auth.attemptSignIn(username, password);
      req.session.userId = user._id;
      return user;
    }
  },
  Mutation: {
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
    },
    addFriend: async (root, { id }, { req, res }, info) => {
      const userId = req.session.userId;

      try {
        const { user, isInFriends } = await checkAddToFriends(userId, id);

        if (String(userId) === String(id)) {
          throw new UserInputError("You can't add yourself");
        } else if (isInFriends) {
          throw new UserInputError('Already friends');
        } else {
          user.friends = [...user.friends, id];
          await user.save();
          return user;
        }
      } catch (e) {
        return e;
      }
    },
    removeFriend: async (root, { id }, { req, res }, info) => {
      const userId = req.session.userId;

      try {
        const { user, isInFriends } = await checkAddToFriends(userId, id);

        if (!isInFriends) {
          throw new UserInputError('User is not in your friendlist');
        } else {
          user.friends = user.friends.filter(
            currentUser => String(currentUser) !== id
          );
          await user.save();
          return user;
        }
      } catch (e) {
        return e;
      }
    }
  },
  User: {
    friends: async (user, args, { req }, info) => {
      return (await user.populate('friends').execPopulate()).friends;
    }
  }
};

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
    addFriend: async (root, { id }, { req, user }, info) => {
      const userId = user.id;

      // TODO: After adding to a user, update also the added person's friend
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
    removeFriend: async (root, { id }, { req, user }, info) => {
      const userId = user.id;

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

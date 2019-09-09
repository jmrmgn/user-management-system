const { isValid } = require('mongoose').Types.ObjectId;
const { UserInputError } = require('apollo-server-express');

const isValidId = id => {
  if (!isValid(id)) {
    throw new UserInputError(`${id} is not a valid ID`);
  }
};

module.exports = {
  isValidId
};

const { gql } = require('apollo-server-express');

const user = require('./user');

const root = gql`
  directive @auth on FIELD_DEFINITION
  directive @guest on FIELD_DEFINITION
  directive @date(format: String) on FIELD_DEFINITION

  type Query {
    _: String
  }

  scalar Date

  type Mutation {
    _: String
  }
`;

module.exports = [root, user];

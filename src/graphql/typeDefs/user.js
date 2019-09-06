const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    users: [User!]!
    user(id: ID!): User
    login(username: String!, password: String!): User
  }

  extend type Mutation {
    signUp(name: String!, username: String!, password: String!): User
    signOut: Boolean
  }

  type User {
    _id: ID!
    name: String
    username: String
  }
`;

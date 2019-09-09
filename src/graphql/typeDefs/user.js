const dateTimeFormat = 'yyyy-mm-dd HH:mm:ss';
const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    me: User @auth
    users: [User!]! @auth
    user(id: ID!): User @auth
    login(username: String!, password: String!): User @guest
  }

  extend type Mutation {
    signUp(name: String!, username: String!, password: String!): User @guest
    signOut: Boolean @auth
  }

  type User {
    _id: ID!
    name: String
    username: String
    createdAt: Date @date(format: "${dateTimeFormat}")
    updatedAt: Date @date(format: "${dateTimeFormat}")
  }
`;

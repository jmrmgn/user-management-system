const dateTimeFormat = 'yyyy-mm-dd HH:mm:ss';
const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    me: User @auth
    users: [User!]! @auth
    user(id: ID!): User @auth
  }

  extend type Mutation {
    addFriend(id: ID!): User! @auth
    removeFriend(id: ID!): User! @auth
    login(username: String!, password: String!): AuthResponse 
    signUp(name: String!, username: String!, password: String!): AuthResponse
  }

  type User {
    _id: ID!
    name: String
    username: String
    friends: [User]!
    createdAt: Date @date(format: "${dateTimeFormat}")
    updatedAt: Date @date(format: "${dateTimeFormat}")
  }

  type AuthResponse {
    token: String
    user: User
  }
`;

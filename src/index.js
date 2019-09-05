const express = require('express');
const session = require('express-session');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const TWO_HOURS = 1000 * 60 * 60 * 2;
const { PORT, NODE_ENV, SESSION_NAME, SESSION_SECRET, DB_URI } = process.env;
const IN_PROD = NODE_ENV === 'production';

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling'
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton'
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books
  }
};

(async () => {
  try {
    await mongoose.connect(DB_URI, { useNewUrlParser: true });

    const app = express();
    app.disable('x-powered-by');

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      playground: !IN_PROD
    });

    apolloServer.applyMiddleware({ app });

    app.use(
      session({
        name: SESSION_NAME,
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          maxAge: TWO_HOURS,
          secure: NODE_ENV === 'production'
        }
      })
    );

    app.listen(PORT, () =>
      console.log(`http://localhost:${PORT}${apolloServer.graphqlPath}`)
    );
  } catch (e) {
    console.log(e);
  }
})();

/*
  Home/Index
    -> Login, Sign up
  Login
    -> Sign up
  Sign Up
    -> Login
  Dashboard
    -> Logout
*/

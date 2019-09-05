const express = require('express');
const session = require('express-session');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const TWO_HOURS = 1000 * 60 * 60 * 2;
const { PORT, NODE_ENV, SESSION_NAME, SESSION_SECRET, DB_URI } = process.env;
const IN_PROD = NODE_ENV === 'production';

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

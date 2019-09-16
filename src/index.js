const express = require('express');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const schemaDirectives = require('./graphql/directives');
const mongoose = require('mongoose');

const TWO_HOURS = 1000 * 60 * 60 * 2;
const {
  PORT,
  FRONTEND_URL,
  NODE_ENV,
  SESSION_NAME,
  SESSION_SECRET,
  DB_URI,
  REDIS_HOST,
  REDIS_PORT
} = process.env;
const IN_PROD = NODE_ENV === 'production';

(async () => {
  try {
    await mongoose.connect(DB_URI, { useNewUrlParser: true });

    const app = express();
    app.disable('x-powered-by');

    const redisClient = redis.createClient();
    const store = new RedisStore({
      host: REDIS_HOST,
      port: REDIS_PORT,
      client: redisClient
    });

    app.use(
      session({
        store,
        name: SESSION_NAME,
        secret: SESSION_SECRET,
        resave: true, // For refreshing of expiry of cookie base on the user activity
        rolling: true,
        saveUninitialized: false,
        cookie: {
          maxAge: parseInt(TWO_HOURS),
          sameSite: true,
          secure: IN_PROD
        }
      })
    );

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      playground: IN_PROD
        ? false
        : {
            settings: {
              'request.credentials': 'include'
            }
          },
      context: ({ req, res }) => ({ req, res })
    });

    apolloServer.applyMiddleware({
      app,
      cors: { origin: FRONTEND_URL, credentials: true }
    });

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

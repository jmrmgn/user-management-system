const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const schemaDirectives = require('./graphql/directives');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { getUser, tokenSigning, sendRefreshToken } = require('./auth');
const { User } = require('./models');

const { SECRET_KEY, PORT, FRONTEND_URL, NODE_ENV, DB_URI } = process.env;
const IN_PROD = NODE_ENV === 'production';

(async () => {
  try {
    await mongoose.connect(DB_URI, { useNewUrlParser: true });

    const app = express();
    app.use(cors({ origin: FRONTEND_URL, credentials: true }));
    app.use(cookieParser());
    app.disable('x-powered-by');

    app.post('/refresh_token', async (req, res, next) => {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) return res.send({ message: '1st', token: '' });

      let payload = null;
      try {
        payload = jwt.verify(refreshToken, SECRET_KEY);
      } catch (err) {
        return res.send({ message: '2nd', token: '' });
      }

      const user = await User.findById(payload.id);
      if (!user) return res.send({ message: '3rd', token: '' });

      const { _id, name } = user;
      const userPayload = { id: _id, name };

      const newRefreshToken = await tokenSigning(userPayload, true);
      const newToken = await tokenSigning(userPayload);

      sendRefreshToken(res, newRefreshToken);
      return res.send({ token: newToken });
    });

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      playground: !IN_PROD,
      context: ({ req, res }) => {
        const user = getUser(req);

        return { req, res, user };
      }
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(PORT, () =>
      console.log(`http://localhost:${PORT}${apolloServer.graphqlPath}`)
    );
  } catch (e) {
    console.log(e);
  }
})();

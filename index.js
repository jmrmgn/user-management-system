const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const TWO_HOURS = 1000 * 60 * 60 * 2;
const { PORT, NODE_ENV, SESSION_NAME, SESSION_SECRET } = process.env;

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

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

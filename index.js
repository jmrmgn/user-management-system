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

const redirectToLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  } else {
    next();
  }
};

const redirectToDashboard = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  } else {
    next();
  }
};

const users = [
  { id: 1, name: 'Jomar', username: 'jomar', password: 'test1234' },
  { id: 2, name: 'Meep', username: 'meep', password: 'test1234' },
  { id: 3, name: 'John', username: 'john', password: 'test1234' }
];

// Use for every route to cache-control
app.use(function(req, res, next) {
  res.set(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
  );
  next();
});

app.use((req, res, next) => {
  const { userId } = req.session;

  if (userId) {
    res.locals.user = users.find(user => user.id === userId);
  }

  next();
});

// Index Page
app.route('/').get((req, res) => {
  const { userId } = req.session;

  return res.send(`
      <html>
        <body>
          <h3>User Management System</h3>
          ${
            !userId
              ? `<a href="/login">Login</a>
                <a href="/signup">Signup</a>`
              : `
              <a href="/dashboard">Dashboard</a>
              <form method="POST" action="/logout">
                <button>Logout</button>
              </form>
              `
          }
        </body>
      </html>
    `);
});

// Login Page
app.get('/login', redirectToDashboard, (req, res) => {
  res.send(`
    <html>
      <body>
        <h3>Login</h3>
        <form method="post" action="/login">
          <label>Username</label>
          <input name="username" placeholder="Enter username" />
          <label>Password</label>
          <input type="password" name="password" placeholder="Enter password" />
          <button>Submit</button>
        </form>
        <a href="/signup">Signup</a>
      </body>
    </html>
  `);
});

app.post('/login', redirectToDashboard, (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const user = users.find(
      user => user.username === username && user.password === password
    );

    if (user) {
      req.session.userId = user.id;
      res.redirect('/dashboard');
    }
  } else {
    res.redirect('/login');
  }
});

// Sign up Page
app.get('/signup', redirectToDashboard, (req, res) => {
  res.send(`
    <html>
      <body>
        <h3>Sign up</h3>
        <form method="post" action="/signup">
          <label>Name</label>
          <input name="name" placeholder="Enter name" />
          <label>Username</label>
          <input name="username" placeholder="Enter username" />
          <label>Password</label>
          <input type="password" name="password" placeholder="Enter password" />
          <button>Submit</button>
        </form>
        <a href="/login">Login</a>
      </body>
    </html>
  `);
});

app.post('/signup', redirectToDashboard, (req, res) => {
  const { name, username, password } = req.body;

  if (name && username && password) {
    const id = users.length + 1;
    const newUser = { id, name, username, password };

    users.push(newUser);
    req.session.userId = id;
    console.log(users);
    res.redirect('/dashboard');
  }
});

// Dashboard Page
app.get('/dashboard', redirectToLogin, (req, res) => {
  const { user } = res.locals;
  res.send(`
  <html>
    <body>
      <h3>Dashboard</h3>
      <label>Welcome to Dashboard</label>
      <ul>
        <li>Name: ${user.name} </li>
        <li>Username: ${user.username} </li>
      </ul>
      <form method="POST" action="/logout">
        <button>Logout</button>
      </form>
    </body>
  </html>
`);
});

app.post('/logout', redirectToLogin, (req, res, next) => {
  if (req.session.userId) {
    req.session.destroy(err => {
      if (err) return next(err);
      res.clearCookie('userId');
      res.redirect('/');
    });
  }
});

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

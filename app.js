const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user');
const MongoStore = require('connect-mongo')(session);
const {MONGO_URL} = require('./libs/db');

const app = express();

const port = 3000 || process.env.PORT;

app.use(session({
  secret: 'abc123',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    url: MONGO_URL,
    autoReconnect: true
  })
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
app.set('view engine', 'ejs');
// conf
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/secret', isLoggedIn, (req, res) => {
  res.render('secret');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', isLoggedIn, (req, res) => {
  req.logout(); // Passport made logout really easy ;)
  res.redirect('/');
});

// POST request

app.post('/register', (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) throw err;
    console.log('User created!');
    passport.authenticate('local')(req, res, () => {
      res.redirect('/secret');
    })
  });
});

app.post('/login', passport.authenticate('local', {successRedirect: '/secret', failureRedirect: '/login'}),(req, res) => {});

// middleware function
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated())
    return next(); // functions ends with a return
  res.redirect('/login');
}

app.listen(port, err => console.log(err ? `Error on port ${port}` : `App running on port ${port}`));

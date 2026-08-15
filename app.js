const express = require('express');
const bodyParser = require('body-parser');
const staticAsset = require('static-asset');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const config = require('./config');
const routes = require('./routes');
const mocks = require('./mocks');

mongoose.connection
  .on('error', error => console.error('MongoDB connection error:', error))
  .on('close', () => console.log('Database connection closed.'))
  .once('open', () => {
    const info = mongoose.connections[0];
    console.log(`Connected to MongoDB at ${info.host}:${info.port}/${info.name}`);
    mocks();
  });

const connectOptions = {};
if (config.user && config.password) {
  connectOptions.auth = {
    username: config.user,
    password: config.password
  };
}

mongoose.connect(config.MONGO_URL, connectOptions).catch(err => {
  console.error('Initial MongoDB connection error:', err.message);
});

// Express
const app = express();

// Sessions
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.MONGO_URL,
      ttl: 14 * 24 * 60 * 60
    })
  })
);

// Sets and uses
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (req.assetFingerprint) {
    res.locals.assetFingerprint = req.assetFingerprint;
  } else if (!res.locals.assetFingerprint) {
    res.locals.assetFingerprint = file => file;
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, config.DESTINATION)));

// jQuery
app.use(express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

// Routes
app.use('/', routes.home);
app.use('/menu', routes.menu);
app.use('/api/auth', routes.auth);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {}
  });
});

app.listen(config.PORT, () =>
  console.log(`PizzaConstructor app listening on port ${config.PORT}!`)
);

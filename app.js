const express = require('express');
const bodyParser = require('body-parser');
const staticAsset = require('static-asset');
const path = require('path');
const session = require('express-session');

//MongoDB
const MongoStore = require('connect-mongo')(session);

const config = require('./config');
const routes = require('./routes');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log * 'Database connection closed.')
  .once('open', () => {
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  });

mongoose.connect(
  config.MONGO_URL,
  {
    useNewUrlParser: true,
    auth: {
      user: config.user,
      password: config.password
    }
  }
);

//Express
const app = express();

//sessions
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

//Sets and uses
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, config.DESTINATION)));

//jQuery
app.use(express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

//Routes
// app.use('/', routes.home);
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
  console.log(`Example app listening on port ${config.PORT}!`)
);

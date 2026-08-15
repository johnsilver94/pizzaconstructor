const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/pizzaconstructor',
  user: process.env.MONGO_USER || process.env.USER,
  password: process.env.MONGO_PASSWORD || process.env.PASSWORD,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  SESSION_SECRET: process.env.SESSION_SECRET || 'pizzaconstructor_dev_secret_key',
  PER_PAGE: process.env.PER_PAGE || 10,
  DESTINATION: 'uploads'
};

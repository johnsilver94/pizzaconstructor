const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    ingrouporder: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: '/img/userimg.png'
    }
  },
  { timestamps: true }
);

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      red: 'User',
      required: true
    },
    category: {
      type: String,
      required: true
    },
    ingredients: [{ name: String }],
    alergents: [{ name: String }],
    size_price: [{ size: String, price: Number }]
  },
  { timestamps: true }
);

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', schema);

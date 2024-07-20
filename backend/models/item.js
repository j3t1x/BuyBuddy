const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  bought: {
    type: Boolean,
    default: false
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;

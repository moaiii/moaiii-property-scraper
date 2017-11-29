const mongoose = require('mongoose');


var propertySchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: true
  },
  yield: {
    type: Number,
    required: false
  },
  pcm: {
    type: Number,
    required: false
  }
});

var Property = mongoose.model('Property', propertySchema, 'Properties');

module.exports = Property;
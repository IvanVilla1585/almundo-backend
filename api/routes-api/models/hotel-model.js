'use strict'

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: 'The name field is required'
  },
  stars: {
    type: Number,
    required: 'The starts field is required'
  },
  price: {
    type: Number,
    required: 'The price field is required'
  },
  image: {
    type: String,
    required: 'The image field is required'
  },
  amenities: {
    type: [String],
    required: 'The amenities field is required'
  }
}, {timestamp: true})

if (!schema.options.toJSON) schema.options.toJSON = {}

/**
 * Add a tranforma method to change _id by id
 * whent toJSON is used.
 */
schema.options.toJSON.transform = (doc, ret) => {
  // remove the _id of every document before returning the result
  ret.id = ret._id
  delete ret._id
  return ret
}

module.exports = mongoose.model('Hotel', schema)

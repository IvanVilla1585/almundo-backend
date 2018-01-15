'use strict'

const mongoose = require('mongoose')
const Promise = require('bluebird')
require('../routes-api/models/hotel-model')

const config = require('./config')

mongoose.Promise = Promise

const db = fn => async (req, res) => {
  const connection = await mongoose.createConnection(config.db)

  // Expose connection
  req.Model = connection.model('Hotel')

  res.on('finish', () => {
    connection.close()
  })

  return fn(req, res)
}

module.exports = db

'use strict'

const express = require('express')
const bodyParse = require('body-parser')

const HotelApi = require('./routes-api/hotel/index')
const app = express()

const port = process.env.PORT || 8081

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET')
  next()
})
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({extended: false}))

// configure routes
const hotelApi = new HotelApi(app)
hotelApi.setUpRoutes()

app.listen(port, () => console.log(`server running in the port ${port}`))

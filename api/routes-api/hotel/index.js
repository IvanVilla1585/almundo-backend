'use strict'

const db = require('../../utils/db')
const data = require('../../data/data')
const {parse} = require('url')

class HotelApi {
  constructor (app = null) {
    if (!app) throw new Error('app is required')
    this.app = app
  }

  /*
  * Function for resolver filters
  * params: @query
  * params: @data
  */
  filterData (query, data) {
    let results = []
    if (query.name) {
      if (query.stars) {
        results = data.filter(item => item.name.includes(query.name) && query.stars.find(star => star === item.stars))
      } else {
        results = data.filter(item => item.name.includes(query.name))
      }
    } else if (query.stars) {
      results = data.filter(item => query.stars.find(star => star === item.stars))
    } else {
      results = data
    }
    return results
  }
  /*
  * Set up routes hotel api
  */
  setUpRoutes () {

    /*
    * Hotels  Query
    * GET /hotels
    * params: stringify query
    *  - ?name=**&stars=[2, 5]
    *  - ?_id=**
    */
    this.app.get('/hotels', async (req, res) => {
      const query = parse(req.url, true).query

      for (const i in query) query[i] = JSON.parse(unescape(query[i])) // parse query to object

      console.log(query)
      const results = this.filterData(query, data)
      res.status(200).json(results)
    })

    /*
    * Hotels Create
    * POST /
    * body: Hotel fields (see validator)
    */
    this.app.post('/', db(async (req, res) => {
      const {Model} = req
      const data = req.body
      let result = {}
      try {
        result = await new Model(data).save()
      } catch (err) {
        console.log('error', err)
        if (err.name && err.name === 'ValidationError') {
          return res.status(400).send({message: err.message})
        }
        return res.status(500).send({message: 'Error: save hotel'})
      }
      return res.status(200).send(result)
    }))

    /*
    * Hotel Update
    * PUT /:id
    * params: @id
    * body: Dataset to update
    */
    this.app.put('/:id', db(async (req, res) => {
      const {Model} = req
      const data = req.body
      const {id} = req.params
      delete data._id
      let result = {}
      try {
        result = await Model.findByIdAndUpdate(id, { $set: data }, { new: true })
      } catch (err) {
        console.log('error', err)
        if (err.name && err.name === 'ValidationError') {
          return res.status(400).send({message: err.message})
        }
        return res.status(500).send({message: 'Error: update hotel'})
      }
      return res.status(200).send(result)
    }))

    /*
    * Hotel Delete
    * DELETE /:id
    * params: @id
    */
    this.app.delete('/:id', db(async (req, res) => {
      const {Model} = req
      const {id} = req.params
      let result = {}
      try {
        result = await Model.findByIdAndRemove(id)
        if (!result) {
          return res.status(404).send({message: 'hotel not found'})
        }
      } catch (err) {
        if (err.name && err.name === 'ValidationError') {
          return res.status(400).send({message: err.message})
        }
        return res.status(500).send({message: 'Error: delete hotel'})
      }
      return res.status(200).send({message: 'delete ok', data: result})
    }))

    /*
    * Hotels  find by id
    * GET /:id
    * params: @id
    */
    this.app.get('/:id', db(async (req, res) => {
      const {Model} = req
      const {id} = req.params
      let result = {}
      try {
        result = await Model.findById(id)
        if (!result) {
          return res.status(404).send({message: 'hotel not found'})
        }
      } catch (err) {
        if (err.name && err.name === 'ValidationError') {
          return res.status(400).send({message: err.message})
        }
        return res.status(500).send({message: 'Error: find by id hotel'})
      }
      return res.status(200).send(result)
    }))

    /*
    * Hotels  Query
    * GET /hotels
    * params: stringify query
    *  - ?name=**&stars=[2, 5]
    *  - ?_id=**
    */
    this.app.get('/', db(async (req, res) => {
      const {Model} = req
      const query = parse(req.url, true).query

      for (const i in query) query[i] = JSON.parse(unescape(query[i])) // parse query to object
      let results = []
      try {
        results = await Model.find(query)
      } catch (err) {
        return res.status(500).send({message: 'Error: find all hotels'})
      }
      return res.status(200).send(results)
    }))
  }
}

module.exports = HotelApi

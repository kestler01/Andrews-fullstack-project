const express = require('express')

const passport = require('passport')

const { handle404, requireOwnership } = require('../../lib/custom_errors')

// const Piece = require('../models/piece')
// const show = require('../models/show')
const Show = require('../models/show')
// const user = require('../models/user')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// Creat a show
// POST /shows
// is an authenticated route
router.post('/shows', requireToken, (req, res, next) => {
  const showData = req.body.show
  showData.owner = req.user_id
  Show.create(showData)
    .then((show) => res.status(201).json({ show }))
    .catch(next)
})

// Index all my shows
// Get /shows
// is an authenticated route
router.get('/show', requireToken, (req, res, next) => {
  Show.find({ owner: req.user._id })
    .then((pieces) => res.json({ pieces }))
    .catch(next)
})

// Show the one show
// Get /shows/id
// is authenticated BUT will check if show is private, and if it is it will require user be owner.
router.get('/show/:id', requireToken, (req, res, next) => {
  Show.findById(req.params._id)
    .then(handle404)
    .then((show) => {
      if (show.isPrivate === true) {
        requireOwnership(req, show)
      } else {
        return show
      }
    })
    .then(show => res.status(200).json(show))
    .catch(next)
})

// Update my show
// PATCH /shows/:id
// is an authenticated route
router.patch('/shows/:id', requireToken, (req, res, next) => {
  Show.findById(req.params._id)
    .then(handle404)
    .then(show => requireOwnership(req, show))
    .then(show => {
      const {name, description, isPrivate, pieces} = req.body.show
      show.name = name
      show.description = description
      show.isPrivate = isPrivate
      show.pieces = pieces
      return show.save()
    })
    .then(show => res.status(200).json({ show }))
    .catch(next)
})

// Delete my show
// Delete /delete/:id
// is an authenticated route
router.delete('/shows/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Show.findById(id)
    .then(handle404)
    .then(show => requireOwnership(req, show))
    .then(show => { return show.deleteOne() })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router

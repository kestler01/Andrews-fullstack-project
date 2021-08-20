const express = require('express')

const passport = require('passport')

const {
  handle404,
  requireOwnership
} = require('../../lib/custom_errors')

const Piece = require('../models/piece')

// const User = require('../models/user')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// Create a piece
// POST /pieces
// is an authenticated route
router.post('/pieces', requireToken, (req, res, next) => {
  const pieceData = req.body.piece
  pieceData.owner = req.user._id
  let piece
  Piece.create(pieceData)
    .then((thisPiece) => {
      piece = thisPiece;
      ((req.user.pieces).push(piece._id))
      return req.user.save()
    })
    .then(() => res.status(201).json({ piece }))
    .catch(next)
})

// INDEX all my pieces
// GET /pieces
// is an authenticated route
router.get('/pieces', requireToken, (req, res, next) => {
  Piece.find({owner: req.user._id})
    .then(pieces => res.json({ pieces }))
    .catch(next)
})

// SHOW one this piece
// GET /pieces/:id
// is an authenticated route that only allows authorized access
router.get('/pieces/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Piece.findById(id)
    .then(handle404)
    .then(piece => requireOwnership(req, piece))
    .then(piece => res.status(200).json({piece}))
    .catch(next)
})

// UPDATE a piece
// PATCH /pieces/:id
// is an authenticated route that only allows authorized access
router.patch('/pieces/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Piece.findById(id)
    .then(handle404)
    .then(piece => requireOwnership(req, piece))
    .then(piece => {
      const {name, medium, description, link} = req.body.piece
      piece.name = name
      piece.medium = medium
      piece.description = description
      piece.link = link
      return piece.save()
    //   piece.name = req.body.piece.name
    //   piece.medium = req.body.piece.medium
    //   piece.description = req.body.piece.description
    //   piece.link = req.body.piece.link
    })
    .then(piece => res.status(200).json({ piece }))
    .catch(next)
})

// Delete a piece
// Delete /delete/:id
// is an authenticated route that only allows authorized access
router.delete('/pieces/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Piece.findById(id)
    .then(handle404)
    .then(piece => requireOwnership(req, piece))
    .then(piece => { return piece.deleteOne() })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router

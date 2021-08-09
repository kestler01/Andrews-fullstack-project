const mongoose = require('mongoose')

const pieceSchema = new mongoose.Schema(
  {
    link: String,
    name: {
      type: String,
      required: true
    },
    medium: {
      type: String,
      required: true
    },
    description: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    shows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Show' }]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Piece', pieceSchema)

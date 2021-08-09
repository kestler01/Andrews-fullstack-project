const mongoose = require('mongoose')

const showSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    isPrivate: Boolean,
    pieces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Piece' }],
    likes: Number,
    comments: []
  },
  { timestamps: true }
)

module.exports = mongoose.model('Show', showSchema)

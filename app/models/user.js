const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true
    },
    // firstName: {   reeling myself in and keeping v1 simpler
    //   type: String,
    //   required: true
    // },
    // lastName: {
    //   type: String,
    //   required: true
    // },
    email: {
      type: String,
      required: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    mediums: String,
    bio: String,
    token: String,
    pieces: [{ type: Schema.Types.ObjectId, ref: 'Piece' }], // will fill with references to art pieces
    shows: [{ type: Schema.Types.ObjectId, ref: 'Show' }]
    // memberSince: Date,
    // website: String,
    // phoneNumber: String,
    // address: String
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      transform: (_doc, user) => {
        delete user.hashedPassword
        delete user.email
        return user
      }
    }
  }
)

//    vVVv wont work, dates have to be subtracted differently than numbers
// memberSchema.virtual('accountAge').get(function () {
//   const currentTime = new Date()
//   return (currentTime - this.createdAt)
// })
// memberSchema.virtual('fullName')
//   .get(function () {
//     return `${this.firstName} ${this.lastName}`
//   })
// memberSchema.virtual('contact')
//   .get(function () {
//     return (` name:${fullName}, email:${email}, phone#:${phoneNumber}, address:${address} `)
//   })
module.exports = mongoose.model('User', userSchema)

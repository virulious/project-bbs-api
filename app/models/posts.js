const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  body: {
    type: String,
    required: true
  },
  commenter: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  token: String
})

module.exports = {
  postSchema
}

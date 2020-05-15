'use strict'
// require dependencies
const express = require('express')
// create an express router object
const router = express.Router()
// require book model
const User = require('./../models/user')
const customErrors = require('../../lib/customErrors')
const handle404 = customErrors.handle404

router.post('/posts', (req, res, next) => {
  // Use express to json to acquire req.body.book and define the object in book
  const post = req.body.post
  const userID = post.user_id
  // Stores the new book in the mongo db
  User.findById(userID)
    // Return the comment as json to the user
    .then(handle404)
    .then(user => {
      user.posts.push(post)
      return user.save()
    })
    .then(user => res.status(201).json({ user: user.toObject() }))
    // return an error in handling the request
    .catch(next)
})

module.exports = router

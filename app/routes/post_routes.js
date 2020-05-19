'use strict'
// require dependencies
const express = require('express')
const passport = require('passport')
// create an express router object
const router = express.Router()
// require post model
const User = require('./../models/user')
const Post = require('./../models/posts')
// const Post = require('./../models/posts')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const checkOwnership = customErrors.checkOwnership
const requireToken = passport.authenticate('bearer', { session: false })
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// To create a post and save it to the user
router.post('/posts', requireToken, (req, res, next) => {
  // Use express to json to acquire req.body.post and define the object in post
  const post = req.body.post
  post.user = req.user.id
  req.body.post.owner = req.user.id
  // Stores the new post in the mongo db
  User.findById(req.body.post.owner)
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

// Return an index of all the posts
router.get('/posts', requireToken, (req, res, next) => {
  User.findById(req.user.id)
    .then(handle404)
    .then(user => {
      return user.posts.map(post => post.toObject())
    })
    .then(posts => res.status(200).json({ posts: posts }))
    .catch(next)
})

// Return a single post queried by ID
router.get('/posts/:id', requireToken, (req, res, next) => {
  const postId = req.params.id
  // Find the user
  User.findById(req.user.id)
    .then(handle404)
    .then(user => {
      return user.posts.id(postId)
    })
    .then(post => {
      res.status(200).json({posts: post})
    })
    .catch(next)
})

// Update a post
router.patch('/posts/:id', requireToken, (req, res, next) => {
  const postId = req.body.post.id
  const newTitle = req.body.post.title
  const newBody = req.body.post.body
  // Find the user
  User.findById(req.user.id)
    .then(handle404)
    .then(user => {
      const post = user.posts.id(postId)
      checkOwnership(post)
      post.title = newTitle
      post.body = newBody
      return user.save()
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    .catch(next)
})

// Delete a post
router.delete('/posts/:id', requireToken, (req, res, next) => {
  // acquire the id from the paramaters and save it in id
  const postId = req.params.id
  // Get the post by id from the database
  User.findById(req.user.id)
    // Check if the post ID exists
    .then(handle404)
    // pull the post
    .then(user => {
      const post = user.posts.id(postId)
      checkOwnership(post)
      user.posts.pull(postId)
      return user.save()
    })
    // return status code affirming destruction of the post
    .then(() => res.sendStatus(204))
    // return an error in handling the request
    .catch(next)
})

module.exports = router

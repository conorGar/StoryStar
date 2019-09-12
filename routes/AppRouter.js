const express = require('express')
const appRouter = express.Router()
const { passport } = require('../auth/auth')

appRouter.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.json({ user: req.user, message: 'authenticated' })
  console.log(req)
})

module.exports = appRouter

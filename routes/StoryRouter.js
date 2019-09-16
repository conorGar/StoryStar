const express = require('express')
const { User, Story, Chapter, Subscription } = require('../database/models')
const StoryRouter = express.Router()

/********* GET -- localhost:PORT/ *********/

StoryRouter.get('/', async (request, response) => {
  try {
    console.log('request')
    const stories = await Story.findAll()

    response.send(stories)
  } catch (e) {
    response.status(500).json({ msg: e.message })
  }
})


/********* GET -- localhost:PORT//2 *********/


StoryRouter.get('/:id', async (request, response) => {
  try {
    const id = request.params.id
    const story = await Story.findByPk(id, {
      include: [User, Chapter]
    })
    if (!story) throw Error
    response.send(story)
  } catch (e) {
    response.status(404).json({ msg: e.message })
  }
})

/********* CREATE -- localhost:PORT/ *********/
StoryRouter.post('/create/user/:id', async (request, response) => {
  try {
    const id = request.params.id
    const story = await Story.create(request.body)
    const user = await User.findByPk(id)
    if (!user) throw Error
    story.setUser(user)
    const users = request.body.username.split(', ')
    users.map(async user => {
      let addedUser = await User.findOne({
        where: {
          username: user
        }
      })
      story.addUser(addedUser)
    })
    response.json(story)
  } catch (e) {
    response.status(500).json({ msg: e.message })
  }
})

/********* UPDATE -- localhost:PORT//2 *********/
StoryRouter.put('/:id', async (request, response) => {
  try {
    const id = request.params.id
    const story = await Story.findByPk(id)
    if (!story) throw Error
    const users = request.body.username.split(', ')
    users.map(async element => {
      let addedUser = await User.findOne({
        where: {
          username: element
        }
      })
      return story.addUser(addedUser)
    })
    await story.update(request.body)
    response.json({
      story
    })
  } catch (e) {
    response.status(304).json({
      message: e.message
    })
  }
})

/********* DELETE -- localhost:PORT//2 *********/
StoryRouter.delete('/:id', async (request, response) => {
  try {
    const id = request.params.id
    const story = await Story.findByPk(id)
    if (!story) throw Error
    await story.destroy()
    response.json({
      message: `story with id ${id} deleted`
    })
  } catch (e) {
    response.json({ msg: e.message })
  }
})

StoryRouter.delete('/:id/user/:username', async (request, response) => {
  try {
    const id = request.params.id
    const username = request.params.username
    const project = await Story.findByPk(id)
    if (!project) throw Error
    const user = await User.findOne({
      username
    })
    if (!user) throw Error
    await project.removeUser(user)

    response.json({
      message: `${username} was deleted from project ${id}`
    })
  } catch (e) {
    response.json({ msg: e.message })
  }
})

module.exports = StoryRouter

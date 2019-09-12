const express = require('express')
const { User, Project } = require('../database/models')
const StoryRouter = express.Router()

/********* GET -- localhost:PORT/ *********/
StoryRouter.get('/', async (request, response) => {
  try {
    console.log('request')
    const projects = await Project.findAll()

    response.send(projects)
  } catch (e) {
    response.status(500).json({ msg: e.message })
  }
})

/********* GET -- localhost:PORT//2 *********/
StoryRouter.get('/:id', async (request, response) => {
  try {
    const id = request.params.id
    const project = await Project.findByPk(id, {
      include: [User]
    })
    if (!project) throw Error
    response.send(project)
  } catch (e) {
    response.status(404).json({ msg: e.message })
  }
})

/********* CREATE -- localhost:PORT/ *********/
StoryRouter.post('/create/user/:id', async (request, response) => {
  try {
    const id = request.params.id
    const project = await Project.create(request.body)
    const user = await User.findByPk(id)
    if (!user) throw Error
    project.setUsers(user)
    const users = request.body.username.split(', ')
    users.map(async user => {
      let addedUser = await User.findOne({
        where: {
          username: user
        }
      })
      project.addUser(addedUser)
    })
    response.json(project)
  } catch (e) {
    response.status(500).json({ msg: e.message })
  }
})

/********* UPDATE -- localhost:PORT//2 *********/
StoryRouter.put('/:id', async (request, response) => {
  try {
    const id = request.params.id
    const project = await Project.findByPk(id)
    if (!project) throw Error
    const users = request.body.username.split(', ')
    users.map(async element => {
      let addedUser = await User.findOne({
        where: {
          username: element
        }
      })
      return project.addUser(addedUser)
    })
    await project.update(request.body)
    response.json({
      project
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
    const project = await Project.findByPk(id)
    if (!project) throw Error
    await project.destroy()
    response.json({
      message: `Project with id ${id} deleted`
    })
  } catch (e) {
    response.json({ msg: e.message })
  }
})

StoryRouter.delete('/:id/user/:username', async (request, response) => {
  try {
    const id = request.params.id
    const username = request.params.username
    const project = await Project.findByPk(id)
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

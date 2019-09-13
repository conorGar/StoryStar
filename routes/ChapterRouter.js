const express = require('express')
const { Chapter, Content, Story } = require('../database/models')
const ChapterRouter = express.Router()

/********* GET -- localhost:PORT/ *********/

ChapterRouter.get('/story/:id', async (request, response) => {
  try {
    const id = request.params.id

    console.log('request')
    // const chapters = await Chapter.findAll({
    //     where: {
    //         storyId: id
    //     }
    // })

    const story = await Chapter.findByPk(id, {
      include: [Content]
    })

    if (!story) throw Error
    response.send(story)
  } catch (e) {
    response.status(404).json({ msg: e.message })
  }

  //   response.send(chapters)
  // } catch (e) {
  //   response.status(500).json({ msg: e.message })
  // }
})


/********* CREATE -- localhost:PORT/ *********/
ChapterRouter.post('/create/story/:id', async (request, response) => {
  try {
    const id = request.params.id
    const chapter = await Chapter.create(request.body)
    const story = await Story.findByPk(id)
    if (!story) throw Error
    chapter.setStory(story)
    response.json(story)
  } catch (e) {
    response.status(500).json({ msg: e.message })
  }
})

/********* UPDATE -- localhost:PORT//2 *********/
ChapterRouter.put('/:id', async (request, response) => {
  try {
    const id = request.params.id
    const story = await Story.findByPk(id)
    if (!story) throw Error
    // const users = request.body.username.split(', ')
    // users.map(async element => {
    //   let addedUser = await User.findOne({
    //     where: {
    //       username: element
    //     }
    //   })
    //   return story.addUser(addedUser)
    // })
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
ChapterRouter.delete('/:id', async (request, response) => {
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

ChapterRouter.delete('/:id/user/:username', async (request, response) => {
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

module.exports = ChapterRouter

const { User, Story, Chapter } = require('./models')



const main = async () => {
    try {
      // empty both tables
      await User.destroy({ where: {} })
      await Story.destroy({ where: {} })
  
      //user seed
      const Conor = await User.create({
        name: 'Conor Garity',
        username: 'conorgar',
        email: 'conorgar@gmail.com',
        password: 'password',
        imgUrl: 'https://pbs.twimg.com/profile_images/75637614/images_400x400.jpg',
        star_points: 0
      })
    
  
      //project seed
      const almostSomebody = await Story.create({
        name: 'Almost Somebody',
        imgUrl: 'http://www.illuminationworksllc.com/wp-content/uploads/2017/04/ProjectManagement-1.jpg',
        description: 'In a near future where humans live forever in robotic suits, one man searches for a way to die',
      })

      const ch1 = await Chapter.create({
          name: 'The Elephants Foot'
      })
     
  
      await almostSomebody.setUser(Conor)
      await Conor.addStory(almostSomebody)
      await almostSomebody.addChapter(ch1)
      await ch1.setStory(almostSomebody)

  
    } catch (error) {
      throw error
    } finally {
      process.exit()
    }
  }
  
  main()
  
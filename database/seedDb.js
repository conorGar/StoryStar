const { User, Story, Chapter, Content } = require('./models')



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

      const ch1_p1 = await Content.create({
          content_link: "https://www.almostsomebodycomic.com/ch1/page1_v3.jpg"
      })



      const ch1_p2 = await Content.create({
        content_link: "https://www.almostsomebodycomic.com/ch1/page2_v2.jpg"

    })
     
  
      await almostSomebody.setUser(Conor)
      await Conor.addStory(almostSomebody)
      await almostSomebody.addChapter(ch1)
      await ch1.setStory(almostSomebody)
      await ch1.addContent(ch1_p1)
      await ch1.addContent(ch1_p2)

      await ch1_p1.setChapter(ch1);
      await ch1_p2.setChapter(ch1);

  
    } catch (error) {
      throw error
    } finally {
      process.exit()
    }
  }
  
  main()
  
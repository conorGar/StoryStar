const express = require('express')
const { Star, Review, User } = require('../database/models')
const ReviewRouter = express.Router()


// **    FIND ALL STARS FOR THIS REVIEW */
ReviewRouter.get('/:id', async (request, response) => {
    try {
      const id = request.params.id
  
      const totalStars = await Star.findAll({
          where: {
              reviewId: id
          }
      })
    //   console.log(totalStars)
      console.log("current id:" + id + "total stars:" + totalStars.length)

    //   if (!totalStars) throw Error
      response.send(totalStars)
    } catch (e) {
      response.status(404).json({ msg: e.message })
    }
  

  })



//*******     Add a star to this review  ******** */
ReviewRouter.post('/:id', async(req,res) =>{
    try{
  
      console.log(req.body)
      
      const id = req.params.id
      console.log("reviewID" + id)
      const newStar = await Star.create()
      const thisReview = await Review.findByPk(id);
    
        console.log("body user ID" + req.body.currentUserId)
      newStar.setReview(thisReview)
      newStar.setUser(req.body.currentUserId)


      //Add to the review poster's star_count
      console.log(thisReview)
      const user = await User.findByPk(thisReview.dataValues.userId)
      console.log(user);
      const currentUserStarPoints = user.dataValues.star_points

      console.log(currentUserStarPoints)
      await user.update({star_points:currentUserStarPoints+1})  

      console.log(user)
      res.json(newStar)
  
  
    }catch(e){
      res.status(500).json({ msg: e.message })
  
    }
  
  })



  ReviewRouter.delete('/:id/:currentUserId', async(req,res) =>{
      try{

        const id= req.params.id;
        const currentUsersId = req.params.currentUserId;
        console.log(req.body)

        console.log("Star delete at review ID of:" + id + "and user ID of: " +currentUsersId)
        const starToDelete = await Star.findOne({
            where:{
                reviewId: id,
                userId: currentUsersId
            }
        })

       await starToDelete.destroy();

       res.json({
        message: `star with id ${id} deleted`
      })

      }catch(e){
      res.status(500).json({ msg: e.message })
    }
  })
  

  module.exports = ReviewRouter

const { Sequelize } = require('sequelize')
const bcrypt = require('bcrypt')

let db;


  db = new Sequelize(process.env.DATABASE_URL , {
    dialect: 'postgres'
  });


// define models
const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  star_points: Sequelize.INTEGER,
  imgUrl: Sequelize.STRING
})

const Story = db.define('story', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imgUrl: {
    type: Sequelize.STRING,
    defaultValue: 'Flatiron District',
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

const Review = db.define('review', {
    points: Sequelize.INTEGER,
    description: Sequelize.TEXT
  })

const Chapter = db.define('chapter', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })

const Star = db.define('star')

User.beforeCreate(async (user, options) => {
  const hashedPassword = await bcrypt.hash(
    user.password,
    Number(process.env.SALT_ROUNDS)
  )
  user.password = hashedPassword
})
// define relationships

User.hasMany(Story, {
  through: 'story_user_xref'
})


Story.belongsTo(User, {
  through: 'story_user_xref'
})

Story.hasMany(Chapter, {
})

Chapter.belongsTo(Story, {
    through: 'story_user_xref'
})

Chapter.hasMany(Review)

Review.hasOne(User)
Review.belongsTo(Chapter)
Review.hasMany(Star);


Star.belongsTo(User);
Star.hasMany(Review);






module.exports = {
  db,
  User,
  Review,
  Story,
  Chapter,
  Star
}

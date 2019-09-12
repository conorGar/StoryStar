const { Sequelize } = require('sequelize')
const bcrypt = require('bcrypt')

// let db;


//   db = new Sequelize(process.env.DATABASE_URL , {
//     dialect: 'postgres'
//   });


// connection to the database
const db = new Sequelize({
  database: 'storystar_db',
  dialect: 'postgres'
})


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

  const Content = db.define('content', {
    content_link: Sequelize.STRING,
    order_value: Sequelize.INTEGER
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

User.hasMany(Story)
User.hasMany(Review)


Story.belongsTo(User)

Story.hasMany(Chapter)

Chapter.belongsTo(Story)

Chapter.hasMany(Review)
Chapter.hasMany(Content)

// Review.hasOne(User)
Review.belongsTo(Chapter)
Review.hasMany(Star);


Star.belongsTo(User);
// Star.hasMany(Review);


Content.belongsTo(Chapter)






module.exports = {
  db,
  User,
  Review,
  Story,
  Chapter,
  Star,
  Content
}

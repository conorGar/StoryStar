const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
const passport = require('passport')
const appRouter = require('./routes/AppRouter')
const AuthRouter = require('./routes/AuthRouter')
const path = require('path');

require('dotenv').config()


// Routing middleware
const StoryRouter = require('./routes/StoryRouter')
const UserRouter = require('./routes/UserRouter')

const PORT = process.env.PORT || 3001


// Static hosting for built files
app.use(express.static(path.join(__dirname, './client/build')));

// Use Body Parser when tied to databses!!!!!
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(logger('dev'))
app.use(cors())
app.use('/auth', AuthRouter)


app.get('/', async (req, res) => {
	res.send('connected')
})

app.use('/story', StoryRouter)


app.use('/users', UserRouter)
app.use('/app', appRouter)


app.use(passport.initialize())

app.get('/', async (req, res) => {
  res.send('connected')
})


// In production, any request that doesn't match a previous route
// should send the front-end application, which will handle the route.
if (process.env.NODE_ENV == "production") {
  app.use('*', (req, res) => res.sendFile(path.join(__dirname, './client/build', "index.html")));
}

app.listen(PORT, () => console.log(`Server Started On Port ${PORT}`))

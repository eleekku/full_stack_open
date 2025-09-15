const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')


const app = express()
mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
	console.log('connected to MongoDB')
  })
  .catch((error) => {
	console.log('error connecting to MongoDB:', error.message)
})


app.use(express.json())
app.use('/api/blogs', blogRouter)

// basic error handler to return error messages during tests
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

module.exports = app

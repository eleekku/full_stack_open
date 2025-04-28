const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})
  
blogRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body)
	try {
	await blog.save()
	}
	catch (error) {
		return response.status(400).json({ error: 'invalid data' })
	}
	response.status(201).json(blog)
})

module.exports = blogRouter
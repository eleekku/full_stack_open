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

blogRouter.delete('/:id', async (request, response, next) => {
	try {
		const id = request.params.id
		const removed = await Blog.findByIdAndDelete(id)
		if (removed) {
			return response.status(204).end()
		}
		return response.status(404).end()
	} catch (error) {
		console.error('Error in DELETE /api/blogs/:id', error.message)
		next(error)
	}
})

blogRouter.put('/:id', async (request, response, next) => {
	const update = request.body
	try {
		const updated = await Blog.findByIdAndUpdate(request.params.id, update, { new: true, runValidators: true, context: 'query' })
		if (updated) {
			return response.json(updated)
		}
		return response.status(404).end()
	} catch (error) {
			console.error('Error in PUT /api/blogs/:id', error.message)
			next(error)
	}
})

module.exports = blogRouter
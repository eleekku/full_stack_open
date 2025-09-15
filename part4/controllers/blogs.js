const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
	response.json(blogs)
})
  
blogRouter.post('/', userExtractor, async (request, response) => {
 	const body = request.body
 	const user = request.user

 	const blog = new Blog({
 		title: body.title,
 		author: body.author,
 		url: body.url,
 		likes: body.likes || 0,
 		user: user._id
 	})

 	try {
 		const saved = await blog.save()
 		user.blogs = user.blogs.concat(saved._id)
 		await user.save()

 		const populated = await Blog.findById(saved._id).populate('user', { username: 1, name: 1 })
 		response.status(201).json(populated)
 	} catch (error) {
 		return response.status(400).json({ error: 'invalid data' })
 	}
})

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
 	try {
 		const id = request.params.id
 		const blog = await Blog.findById(id)
 		if (!blog) {
 			return response.status(404).end()
 		}

 		if (blog.user && blog.user.toString() !== request.user._id.toString()) {
 			return response.status(401).json({ error: 'only the creator can delete the blog' })
 		}

 		await Blog.findByIdAndDelete(id)
 		return response.status(204).end()
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
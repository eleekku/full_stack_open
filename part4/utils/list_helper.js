const _ = require('lodash')

const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
	return blogs.reduce((prev, current) => {
		return prev.likes > current.likes ? prev : current
})
}

const mostBlogs = (blogs) => {
	if (blogs.length === 0) {
		return null
	}
	const authorCount = _.countBy(blogs, 'author')
	const authorWithMostBlogs = _.maxBy(Object.entries(authorCount), ([, count]) => count) 
	return {
		author: authorWithMostBlogs[0],
		blogs: authorWithMostBlogs[1]
	}
}

const monstLikes = (blogs) => {
	if (blogs.length === 0) {
		return null
	}
	const authorLikes = _.reduce(blogs, (acc, blog) => {
		acc[blog.author] = (acc[blog.author] || 0) + blog.likes
		return acc
	}, {})
	const authorWithMostLikes = _.maxBy(Object.entries(authorLikes), ([, likes]) => likes)
	return {
		author: authorWithMostLikes[0],
		likes: authorWithMostLikes[1]
	}
}


  
module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs
}
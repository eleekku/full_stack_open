const { test, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const assert = require('node:assert');
const Blog = require('../models/blog');
const { MONGODB_URI } = require('../utils/config');
const app = require('../app');

const api = supertest(app);

const tableOfBlogs = [
	{
	  _id: "5a422a851b54a676234d17f7",
	  title: "React patterns",
	  author: "Michael Chan",
	  url: "https://reactpatterns.com/",
	  likes: 7,
	  __v: 0
	},
	{
	  _id: "5a422aa71b54a676234d17f8",
	  title: "Go To Statement Considered Harmful",
	  author: "Edsger W. Dijkstra",
	  url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
	  likes: 5,
	  __v: 0
	},
	{
	  _id: "5a422b3a1b54a676234d17f9",
	  title: "Canonical string reduction",
	  author: "Edsger W. Dijkstra",
	  url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
	  likes: 12,
	  __v: 0
	},
	{
	  _id: "5a422b891b54a676234d17fa",
	  title: "First class tests",
	  author: "Robert C. Martin",
	  url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
	  likes: 10,
	  __v: 0
	},
	{
	  _id: "5a422ba71b54a676234d17fb",
	  title: "TDD harms architecture",
	  author: "Robert C. Martin",
	  url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
	  likes: 0,
	  __v: 0
	},
	{
	  _id: "5a422bc61b54a676234d17fc",
	  title: "Type wars",
	  author: "Robert C. Martin",
	  url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
	  likes: 2,
	  __v: 0
	}  
	]

beforeEach(async () => {
	await Blog.deleteMany({});
	const blogObjects = tableOfBlogs.map(blog => new Blog(blog));
	const promiseArray = blogObjects.map(blog => blog.save());
	await Promise.all(promiseArray);
}
);
test('blogs are returned as json', async () => {
	const response = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);

	assert.strictEqual(response.body.length, tableOfBlogs.length);
}
);

test('id is defined', async () => {
	const response = await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);

	response.body.forEach(blog => {
			assert.strictEqual(blog.id !== undefined, true); // Check that 'id' is defined
			assert.strictEqual(blog._id, undefined); // Ensure '_id' is not present
	});
});

test('new blog is added', async () => {
	const newBlog = {
		title: 'New Blog',
		author: 'New Author',
		url: 'http://newblog.com',
		likes: 5
	};
	const response = await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);
	const blogsAtEnd = await api.get('/api/blogs');
	const titles = blogsAtEnd.body.map(blog => blog.title);
	assert.strictEqual(blogsAtEnd.body.length, tableOfBlogs.length + 1);
	assert.strictEqual(titles.includes('New Blog'), true);
	const addedBlog = blogsAtEnd.body.find(blog => blog.title === 'New Blog');
	assert.strictEqual(addedBlog.author, 'New Author');
	assert.strictEqual(addedBlog.url, 'http://newblog.com');
	assert.strictEqual(addedBlog.likes, 5);
}
);

after(async () => {
	await mongoose.connection.close();
}
);
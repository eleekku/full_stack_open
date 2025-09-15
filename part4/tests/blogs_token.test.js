const { test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

let token = null
let userid = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'tester', passwordHash })
  const saved = await user.save()
  userid = saved._id.toString()

  const res = await api
    .post('/api/login')
    .send({ username: 'tester', password: 'sekret' })
    .expect(200)

  token = res.body.token
})

test('creating a blog succeeds with valid token', async () => {
  const newBlog = {
    title: 'Token Blog',
    author: 'Auth',
    url: 'http://token.blog',
    likes: 1
  }

  const res = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(res.body.title, 'Token Blog')
  assert.ok(res.body.user)
  assert.strictEqual(res.body.user.username, 'tester')
})

test('creating a blog fails with 401 if token not provided', async () => {
  const newBlog = {
    title: 'No Token',
    author: 'Anon',
    url: 'http://no.token',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('deletion succeeds only for creator', async () => {
  // create blog as tester
  const created = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'To delete', author: 'T', url: 'http://d', likes: 0 })
    .expect(201)

  const blogId = created.body.id

  // attempt delete without token -> 401
  await api
    .delete(`/api/blogs/${blogId}`)
    .expect(401)

  // create another user
  const pass2 = await bcrypt.hash('other', 10)
  const other = new User({ username: 'other', passwordHash: pass2 })
  await other.save()

  const res = await api.post('/api/login').send({ username: 'other', password: 'other' }).expect(200)
  const otherToken = res.body.token

  // attempt delete as other user -> 401
  await api
    .delete(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${otherToken}`)
    .expect(401)

  // delete as creator -> 204
  await api
    .delete(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
})

after(async () => {
  await mongoose.connection.close()
})

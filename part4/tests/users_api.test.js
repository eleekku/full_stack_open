const { test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  const usernames = usersAtEnd.map(u => u.username)
  assert.ok(usernames.includes(newUser.username))
})

test('creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  assert.ok(result.body.error.includes('expected `username` to be unique') || result.body.error)
})

test('creation fails if username is too short', async () => {
  const newUser = {
    username: 'ab',
    name: 'Shorty',
    password: 'validpass'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.ok(result.body.error.includes('username must be at least 3 characters long'))
})

test('creation fails if password is too short', async () => {
  const newUser = {
    username: 'validuser',
    name: 'ShortPass',
    password: '12'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.ok(result.body.error.includes('password must be at least 3 characters long'))
})

after(async () => {
  await mongoose.connection.close()
})

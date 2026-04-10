import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

const blog = {
  id: '1',
  title: 'Test Blog Title',
  author: 'Test Author',
  url: 'http://testblog.com',
  likes: 7,
  user: { username: 'owner', name: 'Blog Owner' }
}

const renderBlog = (user) =>
  render(
    <MemoryRouter>
      <Blog blog={blog} user={user} onLike={vi.fn()} onDelete={vi.fn()} />
    </MemoryRouter>
  )

test('unauthenticated user sees blog info and likes but no buttons', () => {
  renderBlog(null)

  expect(screen.getByText('Test Blog Title', { exact: false })).toBeDefined()
  expect(screen.getByText('Test Author', { exact: false })).toBeDefined()
  expect(screen.getByText('http://testblog.com')).toBeDefined()
  expect(screen.getByText('likes 7', { exact: false })).toBeDefined()
  expect(screen.getByText('Blog Owner', { exact: false })).toBeDefined()

  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('authenticated non-owner sees like button but not remove', () => {
  renderBlog({ username: 'someoneelse' })

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

test('owner sees both like and remove buttons', () => {
  renderBlog({ username: 'owner' })

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})

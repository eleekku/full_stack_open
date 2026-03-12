import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Test Blog Title',
  author: 'Test Author',
  url: 'http://testblog.com',
  likes: 7,
  user: { username: 'testaaja', name: 'Testaaja Test' }
}

test('title and author, but not url or likes', () => {
  render(<Blog blog={blog} onLike={vi.fn()} onDelete={vi.fn()} user={{ username: 'testuser' }} />)
  expect(screen.getByText('Test Blog Title', { exact: false })).toBeDefined()
  expect(screen.getByText('Test Author', { exact: false })).toBeDefined()
  expect(screen.queryByText('http://testblog.com')).toBeNull()
  expect(screen.queryByText('likes 7', { exact: false })).toBeNull()
})

test('url, likes and user shown after view button click', async () => {
  const user = userEvent.setup()
  render(<Blog blog={blog} onLike={vi.fn()} onDelete={vi.fn()} user={{ username: 'testuser' }} />)
  const button = screen.getByText('view')
  await user.click(button)
  expect(screen.getByText('http://testblog.com')).toBeDefined()
  expect(screen.getByText('likes 7', { exact: false })).toBeDefined()
  expect(screen.getByText('Testaaja Test')).toBeDefined()
})

test('double like calls handler twice', async () => {
  const user = userEvent.setup()
  const mockLike = vi.fn()
  render(<Blog blog={blog} onLike={mockLike} onDelete={vi.fn()} user={{ username: 'testuser' }} />)
  await user.click(screen.getByText('view'))
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockLike.mock.calls).toHaveLength(2)
})

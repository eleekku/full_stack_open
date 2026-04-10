import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import BlogForm from './BlogForm'

// 5.16: form calls createBlog with correct data on submit
test('calls createBlog with correct data on submit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()
  render(
    <MemoryRouter>
      <BlogForm createBlog={createBlog} />
    </MemoryRouter>
  )

  await user.type(screen.getByPlaceholderText('title'), 'New Blog')
  await user.type(screen.getByPlaceholderText('author'), 'New Author')
  await user.type(screen.getByPlaceholderText('url'), 'http://newblog.com')
  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'New Blog',
    author: 'New Author',
    url: 'http://newblog.com'
  })
})

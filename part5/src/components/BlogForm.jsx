import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const navigate = useNavigate()

  const addBlog = async (event) => {
    event.preventDefault()
    await createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addBlog}>
        <div>title <input placeholder='title' value={title} onChange={({ target }) => setTitle(target.value)} /></div>
        <div>author <input placeholder='author' value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
        <div>url <input placeholder='url' value={url} onChange={({ target }) => setUrl(target.value)} /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm

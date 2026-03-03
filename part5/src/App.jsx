import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: null }), 5000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login(username, password)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    const createdBlog = await blogService.create({ title: newTitle, author: newAuthor, url: newUrl })
    setBlogs(blogs.concat(createdBlog))
    notify(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const blogForm = () => (
    <form onSubmit={handleCreate}>
      <div>
        <label>title <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} /></label>
      </div>
      <div>
        <label>author <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} /></label>
      </div>
      <div>
        <label>url <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} /></label>
      </div>
      <button type="submit">create</button>
    </form>
  )

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notification.message} type={notification.type} />

      {!user && loginForm()}

      {user && (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <h3>create new</h3>
          {blogForm()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App
import { useState, useEffect } from 'react'
import {
  Routes, Route, Link, Navigate, useMatch, useNavigate
} from 'react-router-dom'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })

  const navigate = useNavigate()

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

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login(username, password)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      navigate('/')
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const handleCreate = async (blogObject) => {
    const createdBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(createdBlog))
    notify(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  const handleLike = async (blog) => {
    const updated = await blogService.update(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    })
    setBlogs(blogs.map(b => b.id === updated.id ? updated : b))
  }

  const match = useMatch('/blogs/:id')
  const matchedBlog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  const padding = { padding: 5 }

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {user && <Link style={padding} to="/create">create new</Link>}
        {user
          ? <span>{user.name} logged in <button onClick={handleLogout}>logout</button></span>
          : <Link style={padding} to="/login">login</Link>
        }
      </div>

      <Notification message={notification.message} type={notification.type} />

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route
          path="/login"
          element={user ? <Navigate replace to="/" /> : <LoginForm handleLogin={handleLogin} />}
        />
        <Route
          path="/create"
          element={user ? <BlogForm createBlog={handleCreate} /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={matchedBlog}
              user={user}
              onLike={handleLike}
              onDelete={handleDelete}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App

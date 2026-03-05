import { useState } from 'react'

const Blog = ({ blog, onLike, onDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10, paddingLeft: 2,
    border: 'solid', borderWidth: 1, marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={() => onLike(blog)}>like</button></div>
          <div>{blog.user?.name}</div>
          {blog.user?.username === user?.username && (
            <button onClick={() => onDelete(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog

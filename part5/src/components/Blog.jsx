import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, user, onLike, onDelete }) => {
  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  const isOwner = user && blog.user?.username === user.username

  const handleDelete = async () => {
    await onDelete(blog)
    navigate('/')
  }

  return (
    <div className="blog">
      <h2>{blog.title} {blog.author}</h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>
        likes {blog.likes}
        {user && <button onClick={() => onLike(blog)}>like</button>}
      </div>
      <div>added by {blog.user?.name}</div>
      {isOwner && <button onClick={handleDelete}>remove</button>}
    </div>
  )
}

export default Blog

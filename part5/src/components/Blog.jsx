import { useNavigate } from 'react-router-dom'
import {
  Container, Card, CardContent, CardActions, Typography, Button, Stack, Link
} from '@mui/material'

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
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Card className="blog" variant="outlined">
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom>
            {blog.title} {blog.author}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <Link href={blog.url} target="_blank" rel="noopener">
              {blog.url}
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            added by {blog.user?.name}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body1">likes {blog.likes}</Typography>
            {user && (
              <Button variant="outlined" color="secondary" onClick={() => onLike(blog)}>
                like
              </Button>
            )}
          </Stack>
        </CardContent>
        {isOwner && (
          <CardActions>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              remove
            </Button>
          </CardActions>
        )}
      </Card>
    </Container>
  )
}

export default Blog

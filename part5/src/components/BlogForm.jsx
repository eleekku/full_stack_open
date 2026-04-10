import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Paper, Typography, TextField, Button, Stack } from '@mui/material'

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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          create new
        </Typography>
        <form onSubmit={addBlog}>
          <Stack spacing={2}>
            <TextField
              placeholder="title"
              size="small"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
            <TextField
              placeholder="author"
              size="small"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
            <TextField
              placeholder="url"
              size="small"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
            <div>
              <Button type="submit" variant="contained" color="secondary">
                create
              </Button>
            </div>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default BlogForm

import { Link as RouterLink } from 'react-router-dom'
import {
  Container, Typography, List, ListItem, ListItemButton, ListItemText, Paper
} from '@mui/material'

const BlogList = ({ blogs }) => {
  const sorted = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        blogs
      </Typography>
      <Paper variant="outlined">
        <List disablePadding>
          {sorted.map((blog, index) => (
            <ListItem
              key={blog.id}
              divider={index < sorted.length - 1}
              disablePadding
              className="blog"
            >
              <ListItemButton component={RouterLink} to={`/blogs/${blog.id}`}>
                <ListItemText
                  primary={`${blog.title} ${blog.author}`}
                  secondary={`${blog.likes} likes`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  )
}

export default BlogList

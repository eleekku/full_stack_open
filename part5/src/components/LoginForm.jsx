import { useState } from 'react'
import { Container, Paper, Typography, TextField, Button, Stack } from '@mui/material'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    await handleLogin(username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          log in to application
        </Typography>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField
              label="username"
              variant="standard"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            <TextField
              label="password"
              type="password"
              variant="standard"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <div>
              <Button type="submit" variant="contained" color="secondary">
                login
              </Button>
            </div>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default LoginForm

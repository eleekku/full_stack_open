import { Alert, Container } from '@mui/material'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const isError = type === 'error'

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Alert
        severity={isError ? 'error' : 'success'}
        variant="outlined"
        className={isError ? 'error' : 'success'}
        sx={{
          borderStyle: 'solid',
          ...(isError && { color: 'rgb(255, 0, 0)' })
        }}
      >
        {message}
      </Alert>
    </Container>
  )
}

export default Notification

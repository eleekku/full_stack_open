import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#c026d3', // magenta
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#1976d2'
    }
  },
  shape: {
    borderRadius: 8
  }
})

export default theme

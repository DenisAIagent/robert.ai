import { CssBaseline, ThemeProvider, createTheme, Container, Alert } from '@mui/material'
import { ProjectForm } from './components/ProjectForm'
import { GenerationProgress } from './components/GenerationProgress'
import { useProjectStore } from './store/projectStore'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E88E5',
    },
    secondary: {
      main: '#4CAF50',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

function App() {
  const { error, setError } = useProjectStore()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ mt: 2 }}
          >
            {error}
          </Alert>
        )}
        <ProjectForm />
        <GenerationProgress />
      </Container>
    </ThemeProvider>
  )
}

export default App

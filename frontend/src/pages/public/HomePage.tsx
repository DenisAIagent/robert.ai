import { Box, Typography, Container } from '@mui/material'
import { ProjectForm } from '../../components/ProjectForm'
import { GenerationProgress } from '../../components/GenerationProgress'

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          DevCraft AI
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Générez votre projet web en quelques clics avec l'intelligence artificielle
        </Typography>
      </Box>

      <ProjectForm />
      <GenerationProgress />
    </Container>
  )
}

export default HomePage 
import { useEffect, useRef } from 'react'
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Button,
  Stack,
} from '@mui/material'
import { useProjectStore } from '../store/projectStore'
import { connectWebSocket, downloadProject } from '../services/api'

export const GenerationProgress = () => {
  const { currentJob, setCurrentJob } = useProjectStore()
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (currentJob?.job_id) {
      wsRef.current = connectWebSocket(currentJob.job_id, (data) => {
        setCurrentJob(data)
      })
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [currentJob?.job_id, setCurrentJob])

  const handleDownload = async () => {
    if (!currentJob?.job_id) return

    try {
      const blob = await downloadProject(currentJob.job_id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `project-${currentJob.job_id}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
    }
  }

  if (!currentJob) return null

  const getStatusColor = () => {
    switch (currentJob.status) {
      case 'completed':
        return 'success'
      case 'failed':
        return 'error'
      case 'running':
        return 'primary'
      default:
        return 'info'
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Génération du Projet
      </Typography>

      <Box sx={{ width: '100%', mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={currentJob.progress}
          color={getStatusColor()}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {Math.round(currentJob.progress)}%
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {currentJob.message}
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        {currentJob.status === 'completed' && (
          <Button
            variant="contained"
            color="success"
            onClick={handleDownload}
          >
            Télécharger le Projet
          </Button>
        )}
        {currentJob.status === 'failed' && (
          <Button
            variant="contained"
            color="error"
            onClick={() => setCurrentJob(null)}
          >
            Réessayer
          </Button>
        )}
      </Stack>
    </Paper>
  )
} 
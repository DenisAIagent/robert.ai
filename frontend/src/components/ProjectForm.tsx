import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Stack,
  Paper,
  CircularProgress,
} from '@mui/material'
import { useProjectStore } from '../store/projectStore'
import { analyzeProject } from '../services/api'

export const ProjectForm = () => {
  const [description, setDescription] = useState('')
  const [feature, setFeature] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const { isAnalyzing, setIsAnalyzing, setError } = useProjectStore()

  const handleAddFeature = () => {
    if (feature.trim() && !features.includes(feature.trim())) {
      setFeatures([...features, feature.trim()])
      setFeature('')
    }
  }

  const handleRemoveFeature = (featureToRemove: string) => {
    setFeatures(features.filter((f) => f !== featureToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() || features.length === 0) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await analyzeProject({
        description: description.trim(),
        features,
      })

      // TODO: Gérer le résultat de l'analyse
      console.log('Analyse result:', result)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Créer un Nouveau Projet
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description du Projet"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
          disabled={isAnalyzing}
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Fonctionnalités
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Ajouter une fonctionnalité"
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              disabled={isAnalyzing}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddFeature()
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddFeature}
              disabled={!feature.trim() || isAnalyzing}
            >
              Ajouter
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {features.map((f) => (
              <Chip
                key={f}
                label={f}
                onDelete={() => handleRemoveFeature(f)}
                disabled={isAnalyzing}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={!description.trim() || features.length === 0 || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Analyse en cours...
            </>
          ) : (
            'Analyser le Projet'
          )}
        </Button>
      </Box>
    </Paper>
  )
} 
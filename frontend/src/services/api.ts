import axios from 'axios'
import type { ProjectData, JobStatus } from '../store/projectStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const analyzeProject = async (data: ProjectData) => {
  const response = await api.post('/api/analyze', data)
  return response.data
}

export const generateProject = async (data: ProjectData) => {
  const response = await api.post('/api/generate', data)
  return response.data
}

export const getJobStatus = async (jobId: string): Promise<JobStatus> => {
  const response = await api.get(`/api/status/${jobId}`)
  return response.data
}

export const downloadProject = async (jobId: string) => {
  const response = await api.get(`/api/download/${jobId}`, {
    responseType: 'blob',
  })
  return response.data
}

export const connectWebSocket = (jobId: string, onMessage: (data: JobStatus) => void) => {
  const ws = new WebSocket(`${API_URL.replace('http', 'ws')}/api/logs/${jobId}`)
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onMessage(data)
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
  
  return ws
} 
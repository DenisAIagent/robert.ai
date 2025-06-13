import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface ProjectData {
  description: string
  features: string[]
  template_type?: string
  additional_params?: Record<string, any>
}

export interface JobStatus {
  job_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  message: string
  created_at: string
  updated_at: string
}

interface ProjectStore {
  projectData: ProjectData | null
  currentJob: JobStatus | null
  isAnalyzing: boolean
  isGenerating: boolean
  error: string | null
  setProjectData: (data: ProjectData) => void
  setCurrentJob: (job: JobStatus | null) => void
  setIsAnalyzing: (isAnalyzing: boolean) => void
  setIsGenerating: (isGenerating: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  projectData: null,
  currentJob: null,
  isAnalyzing: false,
  isGenerating: false,
  error: null,
}

export const useProjectStore = create<ProjectStore>()(
  devtools(
    (set) => ({
      ...initialState,
      setProjectData: (data) => set({ projectData: data }),
      setCurrentJob: (job) => set({ currentJob: job }),
      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    { name: 'project-store' }
  )
) 
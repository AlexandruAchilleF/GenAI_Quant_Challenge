import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const usePreferencesStore = create(
  persist(
    (set, get) => ({
      likedDiagrams: [],
      dislikedCount: 0,

      likeDiagram: (variant) => {
        if (!variant?.code) return

        const entry = {
          id: `liked-${Date.now()}`,
          timestamp: Date.now(),
          label: variant.label || 'Untitled Diagram',
          code: variant.code,
          diagramType: detectDiagramType(variant.code),
          lineCount: countMeaningfulLines(variant.code),
        }

        set((state) => ({
          likedDiagrams: [...state.likedDiagrams, entry].slice(-20),
        }))
      },

      dislikeDiagram: () => {
        set((state) => ({ dislikedCount: state.dislikedCount + 1 }))
      },

      getStyleSummary: () => {
        const { likedDiagrams } = get()
        if (likedDiagrams.length === 0) return null

        const preferredType = mode(likedDiagrams.map((diagram) => diagram.diagramType))
        const averageLineCount = Math.round(
          likedDiagrams.reduce((sum, diagram) => sum + diagram.lineCount, 0) /
            likedDiagrams.length
        )

        return {
          preferredType,
          averageLineCount,
          totalLiked: likedDiagrams.length,
          summary: `User prefers ${preferredType} Mermaid diagrams with about ${averageLineCount} meaningful lines on average.`,
        }
      },

      clearPreferences: () => set({ likedDiagrams: [], dislikedCount: 0 }),
    }),
    { name: 'diagram-preferences' }
  )
)

function detectDiagramType(code) {
  const firstMeaningfulLine = code
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean)

  if (!firstMeaningfulLine) return 'unknown'
  if (firstMeaningfulLine.startsWith('flowchart') || firstMeaningfulLine.startsWith('graph')) {
    return 'flowchart'
  }
  if (firstMeaningfulLine.startsWith('sequenceDiagram')) return 'sequence'
  if (firstMeaningfulLine.startsWith('erDiagram')) return 'erd'
  if (firstMeaningfulLine.startsWith('stateDiagram-v2')) return 'state'
  if (firstMeaningfulLine.startsWith('classDiagram')) return 'class'
  return 'other'
}

function countMeaningfulLines(code) {
  return code
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean).length
}

function mode(values) {
  const frequency = {}
  values.forEach((value) => {
    frequency[value] = (frequency[value] || 0) + 1
  })

  return (
    Object.entries(frequency).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown'
  )
}

export default usePreferencesStore

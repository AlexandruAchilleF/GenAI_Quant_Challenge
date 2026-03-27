import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const usePreferencesStore = create(
  persist(
    (set, get) => ({
      likedDiagrams: [],
      dislikedCount: 0,

      likeDiagram: (variant) => {
        const entry = {
          id: `liked-${Date.now()}`,
          timestamp: Date.now(),
          nodes: variant.nodes.map((n) => ({
            type: n.type,
            color: n.data?.color,
            shape: n.data?.shape,
          })),
          edges: variant.edges.length,
          layoutDirection: detectLayoutDirection(variant.nodes),
          dominantColors: extractDominantColors(variant.nodes),
          nodeCount: variant.nodes.length,
        }
        set((s) => ({ likedDiagrams: [...s.likedDiagrams, entry].slice(-20) }))
      },

      dislikeDiagram: () => {
        set((s) => ({ dislikedCount: s.dislikedCount + 1 }))
      },

      getStyleSummary: () => {
        const { likedDiagrams } = get()
        if (likedDiagrams.length === 0) return null

        const directions = likedDiagrams.map((d) => d.layoutDirection)
        const preferredDirection = mode(directions)

        const allColors = likedDiagrams.flatMap((d) => d.dominantColors)
        const preferredColors = [...new Set(allColors)].slice(0, 3)

        const avgNodes = Math.round(
          likedDiagrams.reduce((sum, d) => sum + d.nodeCount, 0) / likedDiagrams.length
        )

        return {
          preferredDirection,
          preferredColors,
          avgNodeCount: avgNodes,
          totalLiked: likedDiagrams.length,
          summary: `User prefers ${preferredDirection} layouts with ${preferredColors.join(', ')} as primary colors. Average diagram complexity: ${avgNodes} nodes.`,
        }
      },

      clearPreferences: () => set({ likedDiagrams: [], dislikedCount: 0 }),
    }),
    { name: 'diagram-preferences' }
  )
)

// --- Helpers ---
function detectLayoutDirection(nodes) {
  if (!nodes || nodes.length < 2) return 'top-down'
  const positions = nodes.map((n) => n.position || { x: 0, y: 0 })
  const xSpread = Math.max(...positions.map((p) => p.x)) - Math.min(...positions.map((p) => p.x))
  const ySpread = Math.max(...positions.map((p) => p.y)) - Math.min(...positions.map((p) => p.y))
  return ySpread >= xSpread ? 'top-down' : 'left-right'
}

function extractDominantColors(nodes) {
  const colors = nodes
    .map((n) => n.data?.color)
    .filter(Boolean)
  const freq = {}
  colors.forEach((c) => (freq[c] = (freq[c] || 0) + 1))
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([c]) => c)
}

function mode(arr) {
  const freq = {}
  arr.forEach((v) => (freq[v] = (freq[v] || 0) + 1))
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'top-down'
}

export default usePreferencesStore

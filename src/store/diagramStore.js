import { create } from 'zustand'

const useDiagramStore = create((set, get) => ({
  // Array of variants, each { id, label, nodes[], edges[] }
  variants: [],
  activeVariantIndex: 0,
  isGenerating: false,

  // --- Getters ---
  getActiveVariant: () => {
    const { variants, activeVariantIndex } = get()
    return variants[activeVariantIndex] || null
  },

  getActiveNodes: () => {
    const v = get().getActiveVariant()
    return v ? v.nodes : []
  },

  getActiveEdges: () => {
    const v = get().getActiveVariant()
    return v ? v.edges : []
  },

  // --- Variant management ---
  setVariants: (variants) => set({ variants, activeVariantIndex: 0 }),

  selectVariant: (index) => set({ activeVariantIndex: index }),

  clearVariants: () => set({ variants: [], activeVariantIndex: 0 }),

  setGenerating: (isGenerating) => set({ isGenerating }),

  // --- Node mutations (operate on active variant) ---
  updateNodePosition: (nodeId, position) => {
    set((s) => {
      const variants = [...s.variants]
      const v = { ...variants[s.activeVariantIndex] }
      v.nodes = v.nodes.map((n) =>
        n.id === nodeId ? { ...n, position } : n
      )
      variants[s.activeVariantIndex] = v
      return { variants }
    })
  },

  updateNodeData: (nodeId, dataUpdates) => {
    set((s) => {
      const variants = [...s.variants]
      const v = { ...variants[s.activeVariantIndex] }
      v.nodes = v.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...dataUpdates } } : n
      )
      variants[s.activeVariantIndex] = v
      return { variants }
    })
  },

  updateNodeLabel: (nodeId, label) => {
    set((s) => {
      const variants = [...s.variants]
      const v = { ...variants[s.activeVariantIndex] }
      v.nodes = v.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, label } } : n
      )
      variants[s.activeVariantIndex] = v
      return { variants }
    })
  },

  addNode: (node) => {
    set((s) => {
      const variants = [...s.variants]
      const v = { ...variants[s.activeVariantIndex] }
      v.nodes = [...v.nodes, node]
      variants[s.activeVariantIndex] = v
      return { variants }
    })
  },

  removeNode: (nodeId) => {
    set((s) => {
      const variants = [...s.variants]
      const v = { ...variants[s.activeVariantIndex] }
      v.nodes = v.nodes.filter((n) => n.id !== nodeId)
      v.edges = v.edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
      variants[s.activeVariantIndex] = v
      return { variants }
    })
  },

  // --- Bulk updates (for React Flow onNodesChange / onEdgesChange) ---
  setActiveNodes: (nodes) => {
    set((s) => {
      const variants = [...s.variants]
      const v = { ...variants[s.activeVariantIndex] }
      v.nodes = nodes
      variants[s.activeVariantIndex] = v
      return { variants }
    })
  },

  setActiveEdges: (edges) => {
    set((s) => {
      const variants = [...s.variants]
      const v = { ...variants[s.activeVariantIndex] }
      v.edges = edges
      variants[s.activeVariantIndex] = v
      return { variants }
    })
  },
}))

export default useDiagramStore

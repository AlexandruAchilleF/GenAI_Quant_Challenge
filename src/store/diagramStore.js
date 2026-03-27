import { create } from 'zustand'

const clampIndex = (index, length) => {
  if (length <= 0) return 0
  return Math.min(Math.max(index, 0), length - 1)
}

const useDiagramStore = create((set, get) => ({
  variants: [],
  activeVariantIndex: 0,
  isGenerating: false,

  getActiveVariant: () => {
    const { variants, activeVariantIndex } = get()
    return variants[activeVariantIndex] || null
  },

  setVariants: (variants, activeVariantIndex = 0) =>
    set({
      variants,
      activeVariantIndex: clampIndex(activeVariantIndex, variants.length),
    }),

  selectVariant: (index) =>
    set((state) => ({
      activeVariantIndex: clampIndex(index, state.variants.length),
    })),

  clearVariants: () => set({ variants: [], activeVariantIndex: 0 }),

  setGenerating: (isGenerating) => set({ isGenerating }),
}))

export default useDiagramStore

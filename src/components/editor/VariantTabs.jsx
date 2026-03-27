import useDiagramStore from '../../store/diagramStore'
import { Layers } from 'lucide-react'

export default function VariantTabs() {
  const variants = useDiagramStore((s) => s.variants)
  const activeVariantIndex = useDiagramStore((s) => s.activeVariantIndex)
  const selectVariant = useDiagramStore((s) => s.selectVariant)

  if (variants.length <= 1) return null

  const labels = ['A', 'B', 'C', 'D']

  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-surface-800 bg-surface-900/60 backdrop-blur-sm">
      <Layers className="w-3.5 h-3.5 text-surface-500 mr-1.5" />
      <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mr-2">Variants</span>
      {variants.map((variant, i) => (
        <button
          key={i}
          onClick={() => selectVariant(i)}
          className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            i === activeVariantIndex
              ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
              : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/60 border border-transparent'
          }`}
        >
          <span className="mr-1 font-bold">{labels[i]}</span>
          <span className="hidden sm:inline">{variant.label || `Variant ${labels[i]}`}</span>
          {i === activeVariantIndex && (
            <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-400" />
          )}
        </button>
      ))}
    </div>
  )
}

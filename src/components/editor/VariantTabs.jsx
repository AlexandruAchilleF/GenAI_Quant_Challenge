import useDiagramStore from '../../store/diagramStore'
import { Layers } from 'lucide-react'

export default function VariantTabs() {
  const variants = useDiagramStore((s) => s.variants)
  const activeVariantIndex = useDiagramStore((s) => s.activeVariantIndex)
  const selectVariant = useDiagramStore((s) => s.selectVariant)

  if (variants.length <= 1) return null

  const labels = ['A', 'B', 'C', 'D']

  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-surface-300 bg-surface-100/60 backdrop-blur-sm">
      <Layers className="w-3.5 h-3.5 text-surface-400 mr-1.5" />
      <span className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mr-2">Variants</span>
      {variants.map((variant, i) => (
        <button
          key={i}
          onClick={() => selectVariant(i)}
          className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            i === activeVariantIndex
              ? 'bg-surface-900 text-white'
              : 'text-surface-500 hover:text-surface-900 hover:bg-surface-200 border border-transparent'
          }`}
        >
          <span className="mr-1 font-bold">{labels[i]}</span>
          <span className="hidden sm:inline">{variant.label || `Variant ${labels[i]}`}</span>
        </button>
      ))}
    </div>
  )
}

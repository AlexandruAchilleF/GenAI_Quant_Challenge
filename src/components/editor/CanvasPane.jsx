import { useState } from 'react'
import { Sparkles, FileCode2, TriangleAlert } from 'lucide-react'
import useDiagramStore from '../../store/diagramStore'
import MermaidRenderer from '../MermaidRenderer'
import VariantTabs from './VariantTabs'
import CanvasToolbar from './CanvasToolbar'

export default function CanvasPane() {
  const variants = useDiagramStore((state) => state.variants)
  const activeVariantIndex = useDiagramStore((state) => state.activeVariantIndex)
  const isGenerating = useDiagramStore((state) => state.isGenerating)
  const [renderState, setRenderState] = useState({ key: '', message: '' })

  const variant = variants[activeVariantIndex] || null
  const variantKey = variant
    ? `${activeVariantIndex}:${variant.id}:${variant.label}:${variant.code}`
    : 'empty'
  const renderError = renderState.key === variantKey ? renderState.message : ''

  return (
    <div className="flex-1 flex flex-col relative bg-surface-50 overflow-hidden">
      <VariantTabs />

      <div className="flex-1 relative">
        {variant ? (
          <div className="absolute inset-0 p-4 sm:p-6">
            <div className="h-full rounded-[28px] border border-surface-300 bg-white shadow-lg shadow-surface-400/10 overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-surface-200 bg-surface-50/80">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-surface-400">
                    Mermaid Preview
                  </p>
                  <h3 className="text-sm font-semibold text-surface-800">
                    {variant.label || `Variant ${activeVariantIndex + 1}`}
                  </h3>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-surface-500">
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Rendered with Mermaid.js</span>
                </div>
              </div>

              {renderError ? (
                <div className="h-full overflow-auto p-5 space-y-4 bg-surface-50">
                  <div className="rounded-2xl border border-error-400/40 bg-error-400/10 px-4 py-3 text-sm text-error-500">
                    <div className="flex items-center gap-2 font-semibold mb-1">
                      <TriangleAlert className="w-4 h-4" />
                      <span>Mermaid could not render this variant</span>
                    </div>
                    <p>{renderError}</p>
                  </div>

                  <div className="rounded-2xl border border-surface-300 bg-surface-900 text-surface-100 overflow-auto">
                    <pre className="m-0 p-4 text-xs leading-6 whitespace-pre-wrap">
                      <code>{variant.code}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="h-[calc(100%-61px)] overflow-auto bg-[radial-gradient(circle_at_top,_rgba(251,232,224,0.7),_transparent_38%),linear-gradient(180deg,_#fffdf8_0%,_#f5efe6_100%)]">
                  <MermaidRenderer
                    key={variantKey}
                    code={variant.code}
                    onError={(message) => setRenderState({ key: variantKey, message })}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 rounded-2xl bg-surface-200 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-surface-400" />
              </div>
              <h3 className="text-xl font-semibold text-surface-500 mb-2">No diagram yet</h3>
              <p className="text-surface-400 text-sm max-w-sm">
                Type a prompt in the chat panel to generate Mermaid diagram variants.
              </p>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 bg-surface-50/80 flex items-center justify-center z-20 backdrop-blur-sm">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <p className="text-surface-700 font-medium">AI is generating your Mermaid diagram…</p>
              <p className="text-surface-400 text-sm mt-1">Check the chat for thinking steps</p>
            </div>
          </div>
        )}

        <CanvasToolbar key={variantKey} />
      </div>
    </div>
  )
}

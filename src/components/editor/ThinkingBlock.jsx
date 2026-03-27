import { useState } from 'react'
import { ChevronDown, ChevronUp, Brain } from 'lucide-react'

export default function ThinkingBlock({ steps = [], isStreaming = false }) {
  const [isOpen, setIsOpen] = useState(true)

  if (steps.length === 0 && !isStreaming) return null

  return (
    <div className="my-2 rounded-xl border border-surface-300 bg-surface-100 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-surface-500 hover:text-surface-700 transition-colors"
      >
        <Brain className="w-3.5 h-3.5 text-primary-500" />
        <span className="flex-1 text-left">
          {isStreaming ? 'Agent Thinking…' : 'Thinking Process'}
        </span>
        {isStreaming && (
          <span className="flex gap-1">
            <span className="w-1 h-1 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-1 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-1 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        )}
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="px-3 pb-3 space-y-1.5">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs thinking-step-enter"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              </span>
              <span className="text-surface-600">{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

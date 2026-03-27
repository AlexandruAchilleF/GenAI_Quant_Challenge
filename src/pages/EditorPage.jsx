import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Download,
  ChevronLeft,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'

import ChatPane from '../components/editor/ChatPane'
import CanvasPane from '../components/editor/CanvasPane'
import useDiagramStore from '../store/diagramStore'

function slugify(value) {
  return String(value || 'diagram')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'diagram'
}

export default function EditorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const activeVariant = useDiagramStore((state) => state.getActiveVariant())

  function handleExport() {
    const svgElement = document.querySelector('#mermaid-output svg')
    if (!svgElement) return

    const clonedSvg = svgElement.cloneNode(true)
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    const serializer = new XMLSerializer()
    const markup = serializer.serializeToString(clonedSvg)
    const blob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = `${slugify(activeVariant?.label)}.svg`
    anchor.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-screen flex flex-col bg-surface-50 overflow-hidden">
      <header id="editor-header" className="h-14 flex items-center justify-between px-4 border-b border-surface-300 bg-surface-50/80 backdrop-blur-sm flex-shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-surface-500 hover:text-surface-900 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="w-px h-6 bg-surface-300" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm text-surface-900">DiagramAI</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-200 transition-all"
            title={sidebarOpen ? 'Hide chat' : 'Show chat'}
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>

          <button
            id="export-btn"
            onClick={handleExport}
            disabled={!activeVariant}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all bg-surface-900 text-white hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export SVG</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`${
            sidebarOpen ? 'w-[380px] min-w-[320px]' : 'w-0'
          } flex-shrink-0 border-r border-surface-300 transition-all duration-300 overflow-hidden`}
        >
          <div className="w-[380px] h-full">
            <ChatPane />
          </div>
        </aside>

        <CanvasPane />
      </div>
    </div>
  )
}

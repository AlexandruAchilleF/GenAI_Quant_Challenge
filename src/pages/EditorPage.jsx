import { Link } from 'react-router-dom'
import {
  Sparkles,
  Download,
  ChevronLeft,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import { useState } from 'react'

import ChatPane from '../components/editor/ChatPane'
import CanvasPane from '../components/editor/CanvasPane'

export default function EditorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="h-screen flex flex-col bg-surface-50 overflow-hidden">
      {/* Editor top bar */}
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

        {/* Toolbar right */}
        <div className="flex items-center gap-2">
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-200 transition-all"
            title={sidebarOpen ? 'Hide chat' : 'Show chat'}
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>

          <button
            id="export-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all bg-surface-900 text-white hover:bg-surface-800"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      {/* Main editor area — split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat pane (left) */}
        <aside
          className={`${
            sidebarOpen ? 'w-[380px] min-w-[320px]' : 'w-0'
          } flex-shrink-0 border-r border-surface-300 transition-all duration-300 overflow-hidden`}
        >
          <div className="w-[380px] h-full">
            <ChatPane />
          </div>
        </aside>

        {/* Canvas pane (right) */}
        <CanvasPane />
      </div>
    </div>
  )
}

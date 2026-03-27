import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Download,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  User,
  UserCircle,
  LogOut,
} from 'lucide-react'

import AuthModal from '../components/AuthModal'
import ChatPane from '../components/editor/ChatPane'
import CanvasPane from '../components/editor/CanvasPane'
import useAuthStore from '../store/authStore'
import useDiagramStore from '../store/diagramStore'

const ROLE_CONFIG = {
  work: { label: 'Work', icon: Briefcase, color: 'bg-primary-500 text-white' },
  normal: { label: 'Normal', icon: User, color: 'bg-surface-700 text-white' },
  guest: { label: 'Guest', icon: UserCircle, color: 'bg-surface-400 text-white' },
}

function slugify(value) {
  return String(value || 'diagram')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'diagram'
}

export default function EditorPage() {
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const activeVariant = useDiagramStore((state) => state.getActiveVariant())
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const userRole = useAuthStore((state) => state.userRole)
  const currentUser = useAuthStore((state) => state.currentUser)
  const logout = useAuthStore((state) => state.logout)

  const showAuthPrompt = !isAuthenticated && !authModalOpen
  const roleCfg = userRole ? ROLE_CONFIG[userRole] : null
  const RoleIcon = roleCfg?.icon

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
          {isAuthenticated && roleCfg && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-200/60 border border-surface-300">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleCfg.color}`}>
                {RoleIcon && <RoleIcon className="w-3 h-3" />}
                {roleCfg.label}
              </span>
              <span className="text-xs text-surface-600 font-medium max-w-[120px] truncate hidden sm:inline">
                {currentUser?.email || 'Guest'}
              </span>
            </div>
          )}

          {isAuthenticated && (
            <button
              id="editor-logout"
              onClick={logout}
              className="p-2 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-200 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

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

      <div className="flex flex-1 overflow-hidden relative">
        <aside
          id="chat-sidebar"
          className="flex-shrink-0 border-r border-surface-300 overflow-hidden transition-all duration-300 ease-in-out"
          style={{ width: isChatOpen ? 380 : 0, minWidth: isChatOpen ? 320 : 0 }}
        >
          <div className="w-[380px] h-full">
            <ChatPane />
          </div>
        </aside>

        <button
          id="sidebar-toggle"
          onClick={() => setIsChatOpen((prev) => !prev)}
          className="absolute z-40 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-12 rounded-r-lg bg-surface-200/90 hover:bg-surface-300 border border-l-0 border-surface-300 text-surface-500 hover:text-surface-900 shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out"
          style={{ left: isChatOpen ? 380 : 0 }}
          title={isChatOpen ? 'Collapse chat' : 'Expand chat'}
        >
          {isChatOpen
            ? <ChevronLeft className="w-3.5 h-3.5" />
            : <ChevronRight className="w-3.5 h-3.5" />
          }
        </button>

        <CanvasPane />

        {showAuthPrompt && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface-50/90 backdrop-blur-sm">
            <div className="text-center glass rounded-2xl p-8 max-w-sm mx-4 glow-primary animate-slide-up">
              <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-surface-900 mb-2">Sign in to get started</h3>
              <p className="text-sm text-surface-500 mb-6">
                Login or create an account to generate AI-powered diagrams. Or continue as a guest for a quick try.
              </p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-500 hover:to-primary-400 transition-all shadow-md shadow-primary-600/20 mb-3"
              >
                Login / Sign Up
              </button>
              <button
                onClick={() => useAuthStore.getState().continueAsGuest()}
                className="w-full py-3 rounded-xl border-2 border-surface-300 bg-white text-surface-700 font-semibold text-sm hover:border-surface-400 hover:bg-surface-100 transition-all"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        )}
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  )
}

import { useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Send,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  Loader2,
  ChevronLeft,
  PanelLeftClose,
  PanelLeft,
  Trash2,
  Copy,
} from 'lucide-react'

/* ── Mock AI diagram generation ── */
const DIAGRAM_TEMPLATES = {
  default: {
    nodes: [
      { id: 'gw', label: 'API Gateway', x: 220, y: 40, color: '#4f46e5', w: 140, h: 44 },
      { id: 'auth', label: 'Auth Service', x: 60, y: 150, color: '#0891b2', w: 130, h: 44 },
      { id: 'user', label: 'User Service', x: 230, y: 150, color: '#0891b2', w: 130, h: 44 },
      { id: 'order', label: 'Order Service', x: 400, y: 150, color: '#0891b2', w: 130, h: 44 },
      { id: 'db', label: 'PostgreSQL', x: 210, y: 280, color: '#0e7490', w: 140, h: 44, isDB: true },
    ],
    edges: [
      { from: 'gw', to: 'auth' },
      { from: 'gw', to: 'user' },
      { from: 'gw', to: 'order' },
      { from: 'auth', to: 'db', dashed: true },
      { from: 'user', to: 'db', dashed: true },
      { from: 'order', to: 'db', dashed: true },
    ],
  },
  flow: {
    nodes: [
      { id: 'start', label: 'Start', x: 240, y: 20, color: '#4f46e5', w: 100, h: 40, rounded: true },
      { id: 'input', label: 'User Input', x: 220, y: 90, color: '#0891b2', w: 140, h: 44 },
      { id: 'validate', label: 'Validate?', x: 230, y: 170, color: '#eab308', w: 120, h: 44, diamond: true },
      { id: 'process', label: 'Process Data', x: 220, y: 260, color: '#0891b2', w: 140, h: 44 },
      { id: 'error', label: 'Show Error', x: 430, y: 170, color: '#ef4444', w: 120, h: 44 },
      { id: 'end', label: 'Done', x: 240, y: 340, color: '#22c55e', w: 100, h: 40, rounded: true },
    ],
    edges: [
      { from: 'start', to: 'input' },
      { from: 'input', to: 'validate' },
      { from: 'validate', to: 'process', label: 'Yes' },
      { from: 'validate', to: 'error', label: 'No' },
      { from: 'process', to: 'end' },
      { from: 'error', to: 'input', dashed: true },
    ],
  },
  erd: {
    nodes: [
      { id: 'users', label: 'Users', x: 40, y: 60, color: '#4f46e5', w: 140, h: 110, isTable: true, fields: ['🔑 id', 'name', 'email', 'created_at'] },
      { id: 'orders', label: 'Orders', x: 240, y: 60, color: '#0891b2', w: 140, h: 110, isTable: true, fields: ['🔑 id', '🔗 user_id', 'total', 'status'] },
      { id: 'products', label: 'Products', x: 440, y: 60, color: '#7c3aed', w: 140, h: 110, isTable: true, fields: ['🔑 id', 'name', 'price', '🔗 category_id'] },
    ],
    edges: [
      { from: 'users', to: 'orders', label: '1:N' },
      { from: 'orders', to: 'products', label: 'N:M' },
    ],
  },
}

function detectTemplate(prompt) {
  const lower = prompt.toLowerCase()
  if (lower.includes('flow') || lower.includes('process') || lower.includes('step'))
    return 'flow'
  if (lower.includes('erd') || lower.includes('table') || lower.includes('database') || lower.includes('entity'))
    return 'erd'
  return 'default'
}

/* ── Canvas Renderer ── */
function DiagramCanvas({ diagram, zoom, panOffset }) {
  if (!diagram) return null
  const { nodes, edges } = diagram

  const getCenter = (node) => ({
    x: node.x + (node.w || 120) / 2,
    y: node.y + (node.h || 44) / 2,
  })

  return (
    <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`}>
      {/* Edges */}
      {edges.map((edge, i) => {
        const fromNode = nodes.find(n => n.id === edge.from)
        const toNode = nodes.find(n => n.id === edge.to)
        if (!fromNode || !toNode) return null
        const from = getCenter(fromNode)
        const to = getCenter(toNode)
        return (
          <g key={`edge-${i}`}>
            <line
              x1={from.x} y1={from.y + (fromNode.h || 44) / 2}
              x2={to.x} y2={to.y - (toNode.h || 44) / 2}
              stroke={edge.dashed ? '#22d3ee' : '#6366f1'}
              strokeWidth="2"
              opacity="0.5"
              strokeDasharray={edge.dashed ? '6 4' : 'none'}
            />
            {edge.label && (
              <text
                x={(from.x + to.x) / 2 + 10}
                y={(from.y + (fromNode.h || 44) / 2 + to.y - (toNode.h || 44) / 2) / 2}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="Inter, sans-serif"
              >
                {edge.label}
              </text>
            )}
          </g>
        )
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        if (node.isTable) {
          return (
            <g key={node.id}>
              <rect
                x={node.x} y={node.y}
                width={node.w} height={node.h}
                rx="8" fill="#1e293b" stroke={node.color} strokeWidth="1.5"
              />
              <rect x={node.x} y={node.y} width={node.w} height="28" rx="8" fill={node.color} />
              <rect x={node.x} y={node.y + 20} width={node.w} height="8" fill={node.color} />
              <text x={node.x + node.w / 2} y={node.y + 19} textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter" fontWeight="700">{node.label}</text>
              {node.fields?.map((f, i) => (
                <text key={i} x={node.x + 12} y={node.y + 46 + i * 16} fill="#94a3b8" fontSize="9" fontFamily="Inter">{f}</text>
              ))}
            </g>
          )
        }

        if (node.diamond) {
          const cx = node.x + node.w / 2
          const cy = node.y + node.h / 2
          return (
            <g key={node.id}>
              <polygon
                points={`${cx},${node.y} ${node.x + node.w},${cy} ${cx},${node.y + node.h} ${node.x},${cy}`}
                fill="#1e293b" stroke={node.color} strokeWidth="1.5"
              />
              <text x={cx} y={cy + 4} textAnchor="middle" fill={node.color} fontSize="10" fontFamily="Inter" fontWeight="600">{node.label}</text>
            </g>
          )
        }

        return (
          <g key={node.id}>
            <rect
              x={node.x} y={node.y}
              width={node.w || 120} height={node.h || 44}
              rx={node.rounded ? 22 : 10}
              fill={node.color} opacity="0.9"
            />
            <text
              x={node.x + (node.w || 120) / 2}
              y={node.y + (node.h || 44) / 2 + 4}
              textAnchor="middle" fill="white"
              fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600"
            >
              {node.label}
            </text>
          </g>
        )
      })}
    </g>
  )
}

/* ── Editor Page ── */
export default function EditorPage() {
  const [prompt, setPrompt] = useState('')
  const [diagram, setDiagram] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [panOffset] = useState({ x: 0, y: 0 })
  const [history, setHistory] = useState([])
  const textareaRef = useRef(null)

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return
    setIsGenerating(true)

    // Simulate AI generation delay
    setTimeout(() => {
      const templateKey = detectTemplate(prompt)
      const template = DIAGRAM_TEMPLATES[templateKey]
      setDiagram({ ...template })
      setHistory(prev => [...prev, prompt])
      setIsGenerating(false)
    }, 1500 + Math.random() * 1000)
  }, [prompt])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const handleExport = () => {
    const svgElement = document.getElementById('diagram-canvas')
    if (!svgElement) return
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diagram.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-screen flex flex-col bg-surface-950 overflow-hidden">
      {/* Editor top bar */}
      <header id="editor-header" className="h-14 flex items-center justify-between px-4 border-b border-surface-800 glass flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="w-px h-6 bg-surface-800" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">DiagramAI Editor</span>
          </div>
        </div>

        {/* Toolbar center */}
        <div className="hidden sm:flex items-center gap-1">
          <button id="undo-btn" className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-all" title="Undo">
            <Undo2 className="w-4 h-4" />
          </button>
          <button id="redo-btn" className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-all" title="Redo">
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-surface-800 mx-1" />
          <button id="zoom-in-btn" onClick={() => setZoom(z => Math.min(z + 0.15, 3))} className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-all" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs text-surface-500 min-w-[40px] text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button id="zoom-out-btn" onClick={() => setZoom(z => Math.max(z - 0.15, 0.25))} className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-all" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button id="fit-btn" onClick={() => setZoom(1)} className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-all" title="Fit to screen">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar right */}
        <div className="flex items-center gap-2">
          <button
            id="export-btn"
            onClick={handleExport}
            disabled={!diagram}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-surface-800 text-surface-300 hover:bg-surface-700 hover:text-white"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export SVG</span>
          </button>
        </div>
      </header>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar toggle (mobile) */}
        <button
          id="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed bottom-6 left-6 z-50 w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-600/30"
        >
          {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
        </button>

        {/* Prompt sidebar */}
        <aside
          id="prompt-sidebar"
          className={`${
            sidebarOpen ? 'w-96' : 'w-0'
          } flex-shrink-0 border-r border-surface-800 bg-surface-900/50 transition-all duration-300 overflow-hidden flex flex-col`}
        >
          <div className="p-5 flex-1 flex flex-col min-w-[384px]">
            {/* Prompt input */}
            <div className="mb-4">
              <label htmlFor="prompt-input" className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3 block">
                Describe your diagram
              </label>
              <textarea
                id="prompt-input"
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Create a microservices architecture with API Gateway, Auth, Users, and PostgreSQL..."
                rows={6}
                className="w-full bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-3 text-sm text-surface-200 placeholder-surface-600 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
              />
              <p className="text-xs text-surface-600 mt-2">
                Press <kbd className="px-1.5 py-0.5 bg-surface-800 rounded text-surface-400 font-mono text-[10px]">⌘ Enter</kbd> to generate
              </p>
            </div>

            {/* Generate button */}
            <button
              id="generate-btn"
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary-600 disabled:hover:to-primary-500 active:scale-[0.98]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Generate Diagram
                </>
              )}
            </button>

            {/* Quick prompts */}
            <div className="mt-6">
              <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Quick prompts</div>
              <div className="space-y-2">
                {[
                  'Microservices architecture with API Gateway and databases',
                  'User authentication flow with 2FA',
                  'E-commerce ERD with Users, Orders, Products',
                  'CI/CD pipeline: Build → Test → Deploy',
                ].map((qp) => (
                  <button
                    key={qp}
                    onClick={() => setPrompt(qp)}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs text-surface-400 hover:text-surface-200 hover:bg-surface-800/60 transition-all border border-surface-800/50 hover:border-surface-700"
                  >
                    {qp}
                  </button>
                ))}
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-6 flex-1 overflow-auto">
                <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                  History
                  <button onClick={() => setHistory([])} className="text-surface-600 hover:text-surface-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {history.slice().reverse().map((h, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(h)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-surface-500 hover:text-surface-300 hover:bg-surface-800/40 transition-all truncate flex items-center gap-2"
                    >
                      <Copy className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{h}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Canvas area */}
        <main id="canvas-area" className="flex-1 relative bg-surface-950 overflow-hidden">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Diagram layer */}
          {diagram ? (
            <svg
              id="diagram-canvas"
              className="w-full h-full"
              viewBox="0 0 650 400"
              preserveAspectRatio="xMidYMid meet"
            >
              <DiagramCanvas diagram={diagram} zoom={zoom} panOffset={panOffset} />
            </svg>
          ) : (
            /* Empty state */
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center animate-fade-in">
                <div className="w-20 h-20 rounded-2xl bg-surface-800/50 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-surface-700" />
                </div>
                <h3 className="text-xl font-semibold text-surface-500 mb-2">No diagram yet</h3>
                <p className="text-surface-600 text-sm max-w-sm">
                  Write a prompt in the sidebar and click <strong>Generate</strong> to create your first AI-powered diagram.
                </p>
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-surface-950/80 flex items-center justify-center z-20 backdrop-blur-sm">
              <div className="text-center animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-surface-300 font-medium">AI is generating your diagram…</p>
                <p className="text-surface-600 text-sm mt-1">This usually takes a few seconds</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

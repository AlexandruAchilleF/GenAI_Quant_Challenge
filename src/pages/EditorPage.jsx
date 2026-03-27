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
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import { generateMermaidDiagram } from '../lib/gemini'
import MermaidRenderer from '../components/MermaidRenderer'

/* ── Editor Page ── */
export default function EditorPage() {
  const [prompt, setPrompt] = useState('')
  const [mermaidDiagramCode, setMermaidDiagramCode] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [renderError, setRenderError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [history, setHistory] = useState([])
  const textareaRef = useRef(null)

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    setRenderError(null)

    try {
      const mermaidCode = await generateMermaidDiagram(prompt)
      setMermaidDiagramCode(mermaidCode)
      setHistory(prev => [...prev, prompt])
    } catch (err) {
      console.error('Generation failed:', err)
      setRenderError(
        err.message || 'Failed to generate diagram. Please try again with a different prompt.'
      )
      setMermaidDiagramCode(null)
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, isGenerating])

  const handleMermaidError = useCallback((errorMessage) => {
    setRenderError(
      `Failed to render diagram: the AI generated invalid syntax. Please tweak your prompt and try again.\n\nDetails: ${errorMessage}`
    )
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const handleExport = () => {
    // Grab the rendered Mermaid SVG from the DOM
    const mermaidOutput = document.getElementById('mermaid-output')
    if (!mermaidOutput) return
    const svgElement = mermaidOutput.querySelector('svg')
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
            disabled={!mermaidDiagramCode}
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
          <div className="p-5 flex-1 flex flex-col min-w-[384px] overflow-y-auto">
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

            {/* Mermaid code preview */}
            {mermaidDiagramCode && !renderError && (
              <div className="mt-6">
                <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                  Generated Mermaid Code
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(mermaidDiagramCode)
                    }}
                    className="text-surface-600 hover:text-surface-400 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <pre className="bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-3 text-xs text-surface-400 font-mono overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {mermaidDiagramCode}
                </pre>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="mt-6 flex-1">
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
          <div
            className="absolute inset-0 overflow-auto flex items-center justify-center"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            {mermaidDiagramCode && !renderError ? (
              <MermaidRenderer code={mermaidDiagramCode} onError={handleMermaidError} />
            ) : renderError ? (
              /* Error state */
              <div className="flex items-center justify-center p-8">
                <div className="text-center animate-fade-in max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-error-500/10 flex items-center justify-center mx-auto mb-5">
                    <AlertTriangle className="w-8 h-8 text-error-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-surface-300 mb-2">
                    Diagram Generation Failed
                  </h3>
                  <p className="text-surface-500 text-sm mb-6 leading-relaxed whitespace-pre-line">
                    {renderError}
                  </p>
                  <button
                    onClick={() => {
                      setRenderError(null)
                      handleGenerate()
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-500 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="text-center animate-fade-in">
                <div className="w-20 h-20 rounded-2xl bg-surface-800/50 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-surface-700" />
                </div>
                <h3 className="text-xl font-semibold text-surface-500 mb-2">No diagram yet</h3>
                <p className="text-surface-600 text-sm max-w-sm">
                  Write a prompt in the sidebar and click <strong>Generate</strong> to create your first AI-powered diagram.
                </p>
              </div>
            )}
          </div>

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

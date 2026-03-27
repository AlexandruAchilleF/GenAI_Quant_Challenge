import { useEffect, useRef, useState, useId } from 'react'
import mermaid from 'mermaid'

// Initialize Mermaid with dark theme matching the app's design
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    // Background
    mainBkg: '#1e293b',
    nodeBorder: '#6366f1',
    // Primary colors
    primaryColor: '#4f46e5',
    primaryTextColor: '#f1f5f9',
    primaryBorderColor: '#6366f1',
    // Secondary
    secondaryColor: '#0891b2',
    secondaryTextColor: '#f1f5f9',
    secondaryBorderColor: '#22d3ee',
    // Tertiary
    tertiaryColor: '#1e293b',
    tertiaryTextColor: '#94a3b8',
    tertiaryBorderColor: '#334155',
    // Lines & text
    lineColor: '#6366f1',
    textColor: '#e2e8f0',
    // Flowchart
    nodeTextColor: '#f1f5f9',
    // Fonts
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
    // Background
    background: '#020617',
    // ER Diagram
    attributeBackgroundColorEven: '#1e293b',
    attributeBackgroundColorOdd: '#172032',
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 15,
  },
  sequence: {
    actorMargin: 50,
    boxMargin: 10,
    mirrorActors: false,
  },
  er: {
    layoutDirection: 'TB',
    useMaxWidth: true,
  },
  securityLevel: 'loose',
})

/**
 * MermaidRenderer — renders Mermaid.js code into an SVG diagram.
 *
 * @param {Object} props
 * @param {string} props.code — Raw Mermaid.js syntax to render.
 * @param {function} props.onError — Callback invoked with an error message string when parsing fails.
 */
export default function MermaidRenderer({ code, onError }) {
  const containerRef = useRef(null)
  const [svgContent, setSvgContent] = useState('')
  const [hasError, setHasError] = useState(false)
  const uniqueId = useId()

  useEffect(() => {
    if (!code) {
      setSvgContent('')
      setHasError(false)
      return
    }

    let cancelled = false

    async function renderDiagram() {
      try {
        // Generate a unique ID for this render (Mermaid requires unique IDs)
        const diagramId = `mermaid-${uniqueId.replace(/:/g, '')}-${Date.now()}`

        // Validate syntax first
        await mermaid.parse(code)

        // Render the diagram
        const { svg } = await mermaid.render(diagramId, code)

        if (!cancelled) {
          setSvgContent(svg)
          setHasError(false)
        }
      } catch (err) {
        console.error('Mermaid render error:', err)
        if (!cancelled) {
          setHasError(true)
          setSvgContent('')
          onError?.(
            err.message || 'Failed to parse the generated Mermaid diagram.'
          )
        }
      }
    }

    renderDiagram()

    return () => {
      cancelled = true
    }
  }, [code, uniqueId, onError])

  if (hasError || !svgContent) return null

  return (
    <div
      id="mermaid-output"
      ref={containerRef}
      className="w-full h-full flex items-center justify-center p-8 [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}

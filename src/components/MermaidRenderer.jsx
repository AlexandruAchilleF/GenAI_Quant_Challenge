import { useEffect, useId, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#fbe8e0',
    primaryTextColor: '#2d2a26',
    primaryBorderColor: '#c85a3a',
    secondaryColor: '#ebe5db',
    secondaryTextColor: '#2d2a26',
    secondaryBorderColor: '#a9a298',
    tertiaryColor: '#fffdf8',
    tertiaryTextColor: '#2d2a26',
    tertiaryBorderColor: '#cdc6ba',
    lineColor: '#7a756e',
    textColor: '#2d2a26',
    background: '#fffdf8',
    mainBkg: '#fffdf8',
    nodeBorder: '#c85a3a',
    clusterBkg: '#f5efe6',
    clusterBorder: '#cdc6ba',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
    actorBkg: '#fbe8e0',
    actorBorder: '#c85a3a',
    actorTextColor: '#2d2a26',
    signalColor: '#5c5851',
    signalTextColor: '#2d2a26',
    labelBoxBkgColor: '#fffdf8',
    labelBoxBorderColor: '#cdc6ba',
    attributeBackgroundColorEven: '#fffaf3',
    attributeBackgroundColorOdd: '#f5efe6',
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 20,
    useMaxWidth: true,
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

export default function MermaidRenderer({ code, onError }) {
  const [svgContent, setSvgContent] = useState('')
  const uniqueId = useId()
  const normalizedCode = code?.trim() || ''

  useEffect(() => {
    if (!normalizedCode) return undefined

    let cancelled = false

    async function renderDiagram() {
      try {
        const diagramId = `mermaid-${uniqueId.replace(/:/g, '')}-${Date.now()}`
        await mermaid.parse(normalizedCode)
        const { svg } = await mermaid.render(diagramId, normalizedCode)

        if (!cancelled) {
          setSvgContent(svg)
          onError?.('')
        }
      } catch (error) {
        console.error('Mermaid render error:', error)
        if (!cancelled) {
          setSvgContent('')
          onError?.(
            error.message || 'Failed to parse the generated Mermaid diagram.'
          )
        }
      }
    }

    renderDiagram()

    return () => {
      cancelled = true
    }
  }, [normalizedCode, uniqueId, onError])

  if (!normalizedCode || !svgContent) return null

  return (
    <div
      id="mermaid-output"
      className="w-full h-full flex items-center justify-center p-8 [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}

import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import useDiagramStore from '../../store/diagramStore'
import CustomNode from './CustomNode'
import VariantTabs from './VariantTabs'
import CanvasToolbar from './CanvasToolbar'
import { Sparkles } from 'lucide-react'

const nodeTypes = { custom: CustomNode }

const defaultEdgeOptions = {
  style: { stroke: '#c85a3a', strokeWidth: 2 },
  type: 'smoothstep',
}

export default function CanvasPane() {
  const variants = useDiagramStore((s) => s.variants)
  const activeVariantIndex = useDiagramStore((s) => s.activeVariantIndex)
  const setActiveNodes = useDiagramStore((s) => s.setActiveNodes)
  const setActiveEdges = useDiagramStore((s) => s.setActiveEdges)
  const isGenerating = useDiagramStore((s) => s.isGenerating)

  const variant = variants[activeVariantIndex] || null
  const nodes = variant?.nodes || []
  const edges = variant?.edges || []

  const onNodesChange = useCallback(
    (changes) => {
      if (!variant) return
      const updated = applyNodeChanges(changes, nodes)
      setActiveNodes(updated)
    },
    [nodes, variant, setActiveNodes]
  )

  const onEdgesChange = useCallback(
    (changes) => {
      if (!variant) return
      const updated = applyEdgeChanges(changes, edges)
      setActiveEdges(updated)
    },
    [edges, variant, setActiveEdges]
  )

  const styledEdges = useMemo(
    () =>
      edges.map((e) => ({
        ...e,
        type: 'smoothstep',
        style: {
          stroke: '#c85a3a',
          strokeWidth: 2,
          ...(e.style || {}),
        },
        labelStyle: { fill: '#7a756e', fontSize: 10, fontFamily: 'Inter' },
        labelBgStyle: { fill: '#f5efe6', fillOpacity: 0.9 },
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 4,
      })),
    [edges]
  )

  return (
    <div className="flex-1 flex flex-col relative bg-surface-50 overflow-hidden">
      {/* Variant tabs */}
      <VariantTabs />

      {/* Canvas */}
      <div className="flex-1 relative">
        {variant ? (
          <ReactFlow
            nodes={nodes}
            edges={styledEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            proOptions={{ hideAttribution: true }}
            className="react-flow-zen"
          >
            <Background
              variant="dots"
              gap={20}
              size={1}
              color="#cdc6ba44"
            />
            <Controls />
            <MiniMap
              nodeColor={(n) => n.data?.color || '#c85a3a'}
              maskColor="rgba(245,239,230,0.85)"
            />
          </ReactFlow>
        ) : (
          /* Empty state */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 rounded-2xl bg-surface-200 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-surface-400" />
              </div>
              <h3 className="text-xl font-semibold text-surface-500 mb-2">No diagram yet</h3>
              <p className="text-surface-400 text-sm max-w-sm">
                Type a prompt in the chat panel to generate your first AI-powered diagram.
              </p>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-surface-50/80 flex items-center justify-center z-20 backdrop-blur-sm">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <p className="text-surface-700 font-medium">AI is generating your diagram…</p>
              <p className="text-surface-400 text-sm mt-1">Check the chat for thinking steps</p>
            </div>
          </div>
        )}

        {/* Preference toolbar */}
        <CanvasToolbar />
      </div>
    </div>
  )
}

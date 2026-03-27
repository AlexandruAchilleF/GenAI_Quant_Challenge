import { useCallback, useState, memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import useDiagramStore from '../../store/diagramStore'

function CustomNode({ id, data, selected }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(data.label)
  const updateNodeLabel = useDiagramStore((s) => s.updateNodeLabel)

  const handleDoubleClick = useCallback(() => {
    setEditValue(data.label)
    setIsEditing(true)
  }, [data.label])

  const handleBlur = useCallback(() => {
    setIsEditing(false)
    if (editValue.trim() && editValue !== data.label) {
      updateNodeLabel(id, editValue.trim())
    }
  }, [editValue, data.label, id, updateNodeLabel])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleBlur()
      }
      if (e.key === 'Escape') {
        setIsEditing(false)
        setEditValue(data.label)
      }
    },
    [handleBlur, data.label]
  )

  const color = data.color || '#6366f1'
  const isTable = data.shape === 'table'
  const isDiamond = data.shape === 'diamond'
  const isDatabase = data.shape === 'database'
  const isRounded = data.shape === 'rounded'

  // ── Table / ERD node ──
  if (isTable) {
    return (
      <div
        className={`rounded-lg border overflow-hidden transition-shadow ${
          selected ? 'shadow-lg shadow-primary-500/20 ring-2 ring-primary-400/50' : ''
        }`}
        style={{ borderColor: color, minWidth: 160 }}
        onDoubleClick={handleDoubleClick}
      >
        <Handle type="target" position={Position.Top} className="!bg-surface-600 !w-2 !h-2 !border-surface-800" />

        {/* Header */}
        <div className="px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: color }}>
          {isEditing ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none text-white w-full"
            />
          ) : (
            data.label
          )}
        </div>

        {/* Fields */}
        {data.fields && (
          <div className="bg-surface-850 px-3 py-1.5 space-y-0.5">
            {data.fields.map((f, i) => (
              <div key={i} className="text-[10px] text-surface-400 font-mono">{f}</div>
            ))}
          </div>
        )}

        <Handle type="source" position={Position.Bottom} className="!bg-surface-600 !w-2 !h-2 !border-surface-800" />
      </div>
    )
  }

  // ── Database cylinder node ──
  if (isDatabase) {
    return (
      <div
        className={`relative flex items-center justify-center text-center transition-shadow ${
          selected ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]' : ''
        }`}
        style={{ minWidth: 130, minHeight: 56 }}
        onDoubleClick={handleDoubleClick}
      >
        <Handle type="target" position={Position.Top} className="!bg-surface-600 !w-2 !h-2 !border-surface-800" />

        {/* Cylinder SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 130 60" preserveAspectRatio="none">
          <ellipse cx="65" cy="12" rx="63" ry="10" fill={color} opacity="0.9" />
          <rect x="2" y="12" width="126" height="36" fill={color} opacity="0.8" />
          <ellipse cx="65" cy="48" rx="63" ry="10" fill={color} opacity="0.7" />
        </svg>

        <span className="relative z-10 text-xs font-semibold text-white px-4 pt-1">
          {isEditing ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none text-white text-center w-full"
            />
          ) : (
            data.label
          )}
        </span>

        <Handle type="source" position={Position.Bottom} className="!bg-surface-600 !w-2 !h-2 !border-surface-800" />
      </div>
    )
  }

  // ── Diamond (decision) node ──
  if (isDiamond) {
    return (
      <div
        className={`relative flex items-center justify-center transition-shadow ${
          selected ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]' : ''
        }`}
        style={{ width: 100, height: 100 }}
        onDoubleClick={handleDoubleClick}
      >
        <Handle type="target" position={Position.Top} className="!bg-surface-600 !w-2 !h-2 !border-surface-800 !top-0" />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <polygon
            points="50,4 96,50 50,96 4,50"
            fill="rgba(30,41,59,0.9)"
            stroke={color}
            strokeWidth="2"
          />
        </svg>

        <span className="relative z-10 text-[10px] font-semibold px-2" style={{ color }}>
          {isEditing ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none text-center w-full"
              style={{ color }}
            />
          ) : (
            data.label
          )}
        </span>

        <Handle type="source" position={Position.Bottom} className="!bg-surface-600 !w-2 !h-2 !border-surface-800 !bottom-0" />
        <Handle type="source" position={Position.Right} id="right" className="!bg-surface-600 !w-2 !h-2 !border-surface-800" />
      </div>
    )
  }

  // ── Default / Rounded node ──
  return (
    <div
      className={`px-4 py-2.5 text-xs font-semibold text-white transition-all ${
        isRounded ? 'rounded-full' : 'rounded-xl'
      } ${selected ? 'ring-2 ring-primary-400/50 shadow-lg shadow-primary-500/20' : ''}`}
      style={{
        backgroundColor: color,
        opacity: 0.92,
        minWidth: 110,
        textAlign: 'center',
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} className="!bg-white/20 !w-2 !h-2 !border-0" />

      {isEditing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none text-white text-center w-full"
        />
      ) : (
        data.label
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-white/20 !w-2 !h-2 !border-0" />
    </div>
  )
}

export default memo(CustomNode)

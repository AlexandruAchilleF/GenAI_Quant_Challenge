import { ThumbsUp, ThumbsDown, Star } from 'lucide-react'
import useDiagramStore from '../../store/diagramStore'
import usePreferencesStore from '../../store/preferencesStore'
import { useState } from 'react'

export default function CanvasToolbar() {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [saved, setSaved] = useState(false)

  const getActiveVariant = useDiagramStore((s) => s.getActiveVariant)
  const likeDiagram = usePreferencesStore((s) => s.likeDiagram)
  const dislikeDiagram = usePreferencesStore((s) => s.dislikeDiagram)

  const variant = getActiveVariant()
  if (!variant) return null

  const handleLike = () => {
    if (!liked) {
      likeDiagram(variant)
      setLiked(true)
      setDisliked(false)
    }
  }

  const handleDislike = () => {
    if (!disliked) {
      dislikeDiagram()
      setDisliked(true)
      setLiked(false)
    }
  }

  const handleSave = () => {
    if (!saved) {
      likeDiagram(variant)
      setSaved(true)
    }
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/90 border border-surface-300 backdrop-blur-md shadow-lg shadow-surface-400/10">
      <button
        onClick={handleLike}
        className={`p-2 rounded-xl transition-all ${
          liked
            ? 'bg-success-400/20 text-success-500'
            : 'text-surface-400 hover:text-success-500 hover:bg-success-400/10'
        }`}
        title="Like this variant"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>

      <button
        onClick={handleDislike}
        className={`p-2 rounded-xl transition-all ${
          disliked
            ? 'bg-error-400/20 text-error-500'
            : 'text-surface-400 hover:text-error-500 hover:bg-error-400/10'
        }`}
        title="Dislike this variant"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-surface-300 mx-0.5" />

      <button
        onClick={handleSave}
        className={`p-2 rounded-xl transition-all ${
          saved
            ? 'bg-warning-400/20 text-warning-500'
            : 'text-surface-400 hover:text-warning-500 hover:bg-warning-400/10'
        }`}
        title="Save to favorites"
      >
        <Star className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
      </button>
    </div>
  )
}

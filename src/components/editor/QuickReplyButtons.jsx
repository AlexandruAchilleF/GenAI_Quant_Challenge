export default function QuickReplyButtons({ questions = [], onSelect }) {
  if (questions.length === 0) return null

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs text-surface-500 font-medium">I need a bit more detail. Pick an option or type your own answer:</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect?.(q)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-primary-500/10 text-primary-300 border border-primary-500/20 hover:bg-primary-500/20 hover:border-primary-500/40 transition-all active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}

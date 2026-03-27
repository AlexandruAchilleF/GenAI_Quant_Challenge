import ThinkingBlock from './ThinkingBlock'
import QuickReplyButtons from './QuickReplyButtons'
import { User, Sparkles, Info } from 'lucide-react'

export default function ChatMessage({ message, onQuickReply, isStreamingThinking = false }) {
  const { role, content, thinkingSteps, quickReplies } = message

  if (role === 'system') {
    return (
      <div className="flex items-start gap-2 px-4 py-2 animate-fade-in">
        <Info className="w-3.5 h-3.5 text-surface-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-surface-400 italic">{content}</p>
      </div>
    )
  }

  const isUser = role === 'user'

  return (
    <div className={`flex gap-3 px-4 py-3 animate-fade-in ${isUser ? '' : 'bg-surface-100/60'}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-surface-300'
            : 'bg-primary-500'
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-surface-600" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-surface-500 mb-1">
          {isUser ? 'You' : 'DiagramAI'}
        </p>

        {/* Thinking block (for AI messages) */}
        {!isUser && thinkingSteps && thinkingSteps.length > 0 && (
          <ThinkingBlock steps={thinkingSteps} isStreaming={isStreamingThinking} />
        )}

        {/* Message content */}
        {content && (
          <p className="text-sm text-surface-800 leading-relaxed whitespace-pre-wrap">{content}</p>
        )}

        {/* Quick reply buttons (for disambiguation) */}
        {!isUser && quickReplies && quickReplies.length > 0 && (
          <QuickReplyButtons questions={quickReplies} onSelect={onQuickReply} />
        )}
      </div>
    </div>
  )
}

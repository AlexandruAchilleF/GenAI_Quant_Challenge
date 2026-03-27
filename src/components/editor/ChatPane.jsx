import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Sparkles, Trash2 } from 'lucide-react'
import useChatStore from '../../store/chatStore'
import useDiagramStore from '../../store/diagramStore'
import usePreferencesStore from '../../store/preferencesStore'
import { generateDiagram } from '../../services/aiService'
import ChatMessage from './ChatMessage'
import ThinkingBlock from './ThinkingBlock'

export default function ChatPane() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const messages = useChatStore((s) => s.messages)
  const isThinking = useChatStore((s) => s.isThinking)
  const currentThinkingSteps = useChatStore((s) => s.currentThinkingSteps)
  const addUserMessage = useChatStore((s) => s.addUserMessage)
  const addAIMessage = useChatStore((s) => s.addAIMessage)
  const setThinking = useChatStore((s) => s.setThinking)
  const addThinkingStep = useChatStore((s) => s.addThinkingStep)
  const clearThinkingSteps = useChatStore((s) => s.clearThinkingSteps)
  const clearMessages = useChatStore((s) => s.clearMessages)

  const setVariants = useDiagramStore((s) => s.setVariants)
  const setGenerating = useDiagramStore((s) => s.setGenerating)
  const getActiveVariant = useDiagramStore((s) => s.getActiveVariant)
  const updateNodeLabel = useDiagramStore((s) => s.updateNodeLabel)
  const updateNodeData = useDiagramStore((s) => s.updateNodeData)
  const removeNode = useDiagramStore((s) => s.removeNode)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentThinkingSteps])

  const handleSend = useCallback(
    (text) => {
      const content = (text || input).trim()
      if (!content || isThinking) return

      addUserMessage(content)
      setInput('')
      setThinking(true)
      setGenerating(true)
      clearThinkingSteps()

      generateDiagram(content, {
        onThinkingStep: (step) => {
          addThinkingStep(step)
        },

        onComplete: (variants, thinkingSteps) => {
          setVariants(variants)
          setGenerating(false)
          addAIMessage(
            `I've generated ${variants.length} variant${variants.length > 1 ? 's' : ''} for your diagram. Use the tabs above the canvas to compare them.`,
            { thinkingSteps }
          )
        },

        onDisambiguate: (questions) => {
          setThinking(false)
          setGenerating(false)
          addAIMessage(
            'Your prompt is a bit broad. Let me ask a few clarifying questions to give you the best result.',
            { quickReplies: questions }
          )
        },

        onEdit: (cmd) => {
          setThinking(false)
          setGenerating(false)
          const variant = getActiveVariant()
          if (!variant) {
            addAIMessage('No diagram to edit yet. Generate one first!')
            return
          }

          if (cmd.type === 'rename') {
            const node = variant.nodes.find(
              (n) => n.data.label.toLowerCase().includes(cmd.target)
            )
            if (node) {
              updateNodeLabel(node.id, cmd.newValue.charAt(0).toUpperCase() + cmd.newValue.slice(1))
              addAIMessage(`Done! Renamed "${node.data.label}" to "${cmd.newValue}".`)
            } else {
              addAIMessage(`I couldn't find a node matching "${cmd.target}". Try the exact label name.`)
            }
          } else if (cmd.type === 'recolor') {
            const node = variant.nodes.find(
              (n) => n.data.label.toLowerCase().includes(cmd.target)
            )
            if (node) {
              updateNodeData(node.id, { color: cmd.color })
              addAIMessage(`Updated the color of "${node.data.label}".`)
            } else {
              addAIMessage(`I couldn't find a node matching "${cmd.target}".`)
            }
          } else if (cmd.type === 'remove') {
            const node = variant.nodes.find(
              (n) => n.data.label.toLowerCase().includes(cmd.target)
            )
            if (node) {
              removeNode(node.id)
              addAIMessage(`Removed "${node.data.label}" from the diagram.`)
            } else {
              addAIMessage(`I couldn't find a node matching "${cmd.target}".`)
            }
          }
        },
      })
    },
    [input, isThinking]
  )

  const handleQuickReply = useCallback(
    (reply) => {
      handleSend(reply)
    },
    [handleSend]
  )

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface-100/50">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-surface-300 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-surface-800">AI Chat</span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-200 transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-200 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-surface-400" />
            </div>
            <h3 className="text-sm font-semibold text-surface-600 mb-1">Ask me anything</h3>
            <p className="text-xs text-surface-400 max-w-[240px]">
              Describe your diagram or ask me to edit the current one. I'll generate multiple variants for you.
            </p>

            {/* Quick prompts */}
            <div className="mt-6 space-y-1.5 w-full">
              {[
                'Microservices architecture with API Gateway',
                'User authentication flow with 2FA',
                'E-commerce ERD schema',
                'CI/CD pipeline: Build → Test → Deploy',
              ].map((qp) => (
                <button
                  key={qp}
                  onClick={() => { setInput(qp); handleSend(qp) }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-surface-600 hover:text-surface-900 hover:bg-surface-200 transition-all border border-surface-200 hover:border-surface-300"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onQuickReply={handleQuickReply}
          />
        ))}

        {/* Live thinking stream */}
        {isThinking && currentThinkingSteps.length > 0 && (
          <div className="px-4 py-3 bg-primary-50/50">
            <ThinkingBlock steps={currentThinkingSteps} isStreaming={true} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-surface-300 flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isThinking ? 'Thinking…' : 'Describe your diagram or edit...'}
            disabled={isThinking}
            className="flex-1 bg-white border border-surface-300 rounded-xl px-3 py-2.5 text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isThinking}
            className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-surface-400 mt-1.5 px-1">
          Press <kbd className="px-1 py-0.5 bg-surface-200 rounded text-surface-500 font-mono text-[9px]">Enter</kbd> to send · Try "rename X to Y" or "make X blue"
        </p>
      </div>
    </div>
  )
}

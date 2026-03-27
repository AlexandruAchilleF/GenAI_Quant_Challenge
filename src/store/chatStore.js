import { create } from 'zustand'

let msgId = 0
const genId = () => `msg-${++msgId}-${Date.now()}`

const useChatStore = create((set) => ({
  messages: [],
  isThinking: false,
  currentThinkingSteps: [],

  addUserMessage: (content) => {
    const message = { id: genId(), role: 'user', content, timestamp: Date.now() }
    set((s) => ({ messages: [...s.messages, message] }))
    return message
  },

  addAIMessage: (content, { thinkingSteps = [], quickReplies = [] } = {}) => {
    const message = {
      id: genId(),
      role: 'ai',
      content,
      thinkingSteps,
      quickReplies,
      timestamp: Date.now(),
    }
    set((s) => ({ messages: [...s.messages, message], isThinking: false, currentThinkingSteps: [] }))
    return message
  },

  addSystemMessage: (content) => {
    const message = { id: genId(), role: 'system', content, timestamp: Date.now() }
    set((s) => ({ messages: [...s.messages, message] }))
    return message
  },

  setThinking: (isThinking) => set({ isThinking }),

  addThinkingStep: (step) => {
    set((s) => ({ currentThinkingSteps: [...s.currentThinkingSteps, step] }))
  },

  clearThinkingSteps: () => set({ currentThinkingSteps: [] }),

  clearMessages: () => set({ messages: [], isThinking: false, currentThinkingSteps: [] }),
}))

export default useChatStore

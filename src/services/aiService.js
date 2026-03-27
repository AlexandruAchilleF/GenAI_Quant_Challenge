/**
 * AI Service — Calls local Ollama (glm-4.7-flash) for real diagram generation.
 * Retains local edit-command parsing and vague-prompt disambiguation.
 */

import { generateDiagramJSON } from '../lib/ollama'

// ── Disambiguation questions for vague prompts ──

const DISAMBIGUATION = {
  architecture: [
    'Should this be a microservices or monolithic architecture?',
    'Do you need a caching layer (e.g., Redis)?',
    'Should it include a message queue for async processing?',
  ],
  diagram: [
    'What type of diagram? (System architecture, flowchart, ERD, pipeline)',
    'How many main components should it have?',
    'Should it include database connections?',
  ],
  system: [
    'Is this a web application, mobile backend, or IoT system?',
    'Should I include authentication and authorization?',
    'What scale — startup MVP or enterprise grade?',
  ],
}

// ── Thinking steps (shown while waiting for Ollama) ──

const THINKING_STEPS = [
  'Analyzing your prompt...',
  'Designing component layout...',
  'Identifying relationships and data flow...',
  'Generating multiple layout variants...',
  'Finalizing diagram structure...',
]

// ── Helpers ──

function isVaguePrompt(prompt) {
  const words = prompt.trim().split(/\s+/).length
  const vaguePatterns = [
    /^make\s+(a|me)\s+/i,
    /^create\s+(a|me)\s+/i,
    /^draw\s+(a|me)\s+/i,
    /^generate\s+(a|me)\s+/i,
  ]
  const isGenericPhrase = vaguePatterns.some((p) => p.test(prompt.trim()))
  return words < 6 && isGenericPhrase
}

function getDisambiguationQuestions(prompt) {
  const lower = prompt.toLowerCase()
  if (lower.includes('architect')) return DISAMBIGUATION.architecture
  if (lower.includes('system')) return DISAMBIGUATION.system
  return DISAMBIGUATION.diagram
}

function parseEditCommand(prompt) {
  const lower = prompt.toLowerCase().trim()

  // "rename X to Y" or "change X to Y"
  const renameMatch = lower.match(/(?:rename|change)\s+(?:the\s+)?(.+?)\s+(?:to|into)\s+(.+)/i)
  if (renameMatch) {
    return { type: 'rename', target: renameMatch[1].trim(), newValue: renameMatch[2].trim() }
  }

  // "make X blue" or "change X color to blue"
  const colorMap = {
    blue: '#6366f1', red: '#ef4444', green: '#22c55e', yellow: '#eab308',
    purple: '#7c3aed', cyan: '#0891b2', orange: '#f59e0b', pink: '#ec4899',
    coral: '#c85a3a', teal: '#0e7490',
  }
  const colorMatch = lower.match(/(?:make|change|set)\s+(?:the\s+)?(.+?)\s+(?:to\s+)?(\w+)$/i)
  if (colorMatch && colorMap[colorMatch[2]]) {
    return { type: 'recolor', target: colorMatch[1].trim(), color: colorMap[colorMatch[2]] }
  }

  // "remove X" or "delete X"
  const removeMatch = lower.match(/(?:remove|delete)\s+(?:the\s+)?(.+)/i)
  if (removeMatch) {
    return { type: 'remove', target: removeMatch[1].trim() }
  }

  return null
}

// ── Core Service ──

/**
 * Main generation function.
 * @param {string} prompt
 * @param {object} options - { onThinkingStep, onComplete, onDisambiguate, onEdit }
 */
export function generateDiagram(prompt, { onThinkingStep, onComplete, onDisambiguate, onEdit }) {
  // 1. Check for edit commands first
  const editCmd = parseEditCommand(prompt)
  if (editCmd) {
    setTimeout(() => onEdit?.(editCmd), 300)
    return
  }

  // 2. Check if prompt is too vague
  if (isVaguePrompt(prompt)) {
    const questions = getDisambiguationQuestions(prompt)
    setTimeout(() => onDisambiguate?.(questions), 600)
    return
  }

  // 3. Full generation via Ollama
  // Stream thinking steps while waiting
  let stepIndex = 0
  const stepInterval = setInterval(() => {
    if (stepIndex < THINKING_STEPS.length) {
      onThinkingStep?.(THINKING_STEPS[stepIndex])
      stepIndex++
    }
  }, 600)

  generateDiagramJSON(prompt)
    .then((variants) => {
      clearInterval(stepInterval)
      // Emit any remaining thinking steps
      while (stepIndex < THINKING_STEPS.length) {
        onThinkingStep?.(THINKING_STEPS[stepIndex])
        stepIndex++
      }
      onComplete?.(variants, THINKING_STEPS)
    })
    .catch((err) => {
      clearInterval(stepInterval)
      console.error('Ollama generation failed:', err)
      // Report error as an AI message
      onComplete?.(
        [],
        [...THINKING_STEPS.slice(0, stepIndex), `⚠ Error: ${err.message}`]
      )
    })
}

export { parseEditCommand }

/**
 * AI Service — Calls local Ollama (glm-4.7-flash) for Mermaid diagram generation.
 * Supports vague-prompt disambiguation and Mermaid-based revision requests.
 */

import { generateDiagramVariants, reviseDiagramVariant } from '../lib/ollama'

const DISAMBIGUATION = {
  architecture: [
    'Should this be a high-level architecture or an implementation-level diagram?',
    'Do you want external systems like email, payments, or queues included?',
    'Should the layout be left-to-right or top-down?',
  ],
  diagram: [
    'What type of diagram do you want? Flowchart, sequence, ERD, or architecture?',
    'How many major components or steps should it include?',
    'Should I optimize for simplicity or completeness?',
  ],
  system: [
    'Is this a web app, backend platform, or data pipeline?',
    'Should authentication, storage, and integrations be included?',
    'Is this meant to be an MVP overview or a production-grade design?',
  ],
}

const GENERATION_STEPS = [
  'Analyzing your prompt...',
  'Choosing the best Mermaid diagram type...',
  'Designing alternative Mermaid layouts...',
  'Validating Mermaid syntax...',
  'Finalizing diagram variants...',
]

const REVISION_STEPS = [
  'Reading the current Mermaid diagram...',
  'Applying your requested changes...',
  'Rebalancing the structure...',
  'Validating Mermaid syntax...',
  'Preparing the revised variant...',
]

const COLOR_WORDS = new Set([
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'orange',
  'pink',
  'teal',
  'cyan',
  'indigo',
  'violet',
  'amber',
  'gray',
  'grey',
  'black',
  'white',
  'brown',
  'gold',
  'silver',
  'coral',
])

function isVaguePrompt(prompt) {
  const words = prompt.trim().split(/\s+/).length
  const vaguePatterns = [
    /^make\s+(a|me)\s+/i,
    /^create\s+(a|me)\s+/i,
    /^draw\s+(a|me)\s+/i,
    /^generate\s+(a|me)\s+/i,
  ]
  const isGenericPhrase = vaguePatterns.some((pattern) => pattern.test(prompt.trim()))
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

  const renameMatch = lower.match(/^(?:rename|change)\s+(?:the\s+)?(.+?)\s+(?:to|into)\s+(.+)$/i)
  if (renameMatch) {
    return { type: 'rename', target: renameMatch[1].trim(), newValue: renameMatch[2].trim() }
  }

  const recolorMatch = lower.match(
    /^(?:make|change|set)\s+(?:the\s+)?(.+?)\s+(?:color\s+to|to)?\s*(\w+)$/i
  )
  if (recolorMatch && COLOR_WORDS.has(recolorMatch[2].trim())) {
    return { type: 'recolor', target: recolorMatch[1].trim(), newValue: recolorMatch[2].trim() }
  }

  const removeMatch = lower.match(/^(?:remove|delete)\s+(?:the\s+)?(.+)$/i)
  if (removeMatch) {
    return { type: 'remove', target: removeMatch[1].trim() }
  }

  return null
}

export function generateDiagram(
  prompt,
  { currentVariant, onThinkingStep, onComplete, onDisambiguate, onError }
) {
  const editCmd = currentVariant ? parseEditCommand(prompt) : null

  if (editCmd && !currentVariant) {
    setTimeout(
      () => onError?.(new Error('No diagram to edit yet. Generate one first!'), [], { mode: 'edit' }),
      150
    )
    return
  }

  if (!editCmd && isVaguePrompt(prompt)) {
    const questions = getDisambiguationQuestions(prompt)
    setTimeout(() => onDisambiguate?.(questions), 600)
    return
  }

  const thinkingSteps = editCmd ? REVISION_STEPS : GENERATION_STEPS
  const mode = editCmd ? 'edit' : 'generate'

  let stepIndex = 0
  const stepInterval = setInterval(() => {
    if (stepIndex < thinkingSteps.length) {
      onThinkingStep?.(thinkingSteps[stepIndex])
      stepIndex++
    }
  }, 600)

  const request = editCmd
    ? reviseDiagramVariant(currentVariant, prompt).then((variant) => [variant])
    : generateDiagramVariants(prompt)

  request
    .then((variants) => {
      clearInterval(stepInterval)
      while (stepIndex < thinkingSteps.length) {
        onThinkingStep?.(thinkingSteps[stepIndex])
        stepIndex++
      }
      onComplete?.(variants, thinkingSteps, { mode })
    })
    .catch((err) => {
      clearInterval(stepInterval)
      onError?.(err, thinkingSteps.slice(0, stepIndex), { mode })
    })
}

export { parseEditCommand }

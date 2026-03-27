/**
 * Mock AI Service — Simulates diagram generation with thinking steps,
 * multi-variant output, and proactive disambiguation.
 */

import usePreferencesStore from '../store/preferencesStore'

// ── Diagram Templates (React Flow format) ──

const TEMPLATES = {
  microservices: [
    // Variant A — Top-down
    {
      label: 'Top-Down Architecture',
      nodes: [
        { id: 'gw', type: 'custom', position: { x: 300, y: 0 }, data: { label: 'API Gateway', color: '#6366f1', shape: 'rounded' } },
        { id: 'auth', type: 'custom', position: { x: 50, y: 140 }, data: { label: 'Auth Service', color: '#0891b2', shape: 'default' } },
        { id: 'user', type: 'custom', position: { x: 300, y: 140 }, data: { label: 'User Service', color: '#0891b2', shape: 'default' } },
        { id: 'order', type: 'custom', position: { x: 550, y: 140 }, data: { label: 'Order Service', color: '#0891b2', shape: 'default' } },
        { id: 'cache', type: 'custom', position: { x: 50, y: 280 }, data: { label: 'Redis Cache', color: '#dc2626', shape: 'database' } },
        { id: 'db', type: 'custom', position: { x: 300, y: 280 }, data: { label: 'PostgreSQL', color: '#0e7490', shape: 'database' } },
        { id: 'queue', type: 'custom', position: { x: 550, y: 280 }, data: { label: 'Message Queue', color: '#7c3aed', shape: 'rounded' } },
      ],
      edges: [
        { id: 'e1', source: 'gw', target: 'auth', animated: true },
        { id: 'e2', source: 'gw', target: 'user', animated: true },
        { id: 'e3', source: 'gw', target: 'order', animated: true },
        { id: 'e4', source: 'auth', target: 'cache', style: { strokeDasharray: '6 4' } },
        { id: 'e5', source: 'user', target: 'db', style: { strokeDasharray: '6 4' } },
        { id: 'e6', source: 'order', target: 'db', style: { strokeDasharray: '6 4' } },
        { id: 'e7', source: 'order', target: 'queue' },
      ],
    },
    // Variant B — Left-to-Right
    {
      label: 'Left-to-Right Flow',
      nodes: [
        { id: 'client', type: 'custom', position: { x: 0, y: 150 }, data: { label: 'Client App', color: '#22c55e', shape: 'rounded' } },
        { id: 'lb', type: 'custom', position: { x: 200, y: 150 }, data: { label: 'Load Balancer', color: '#eab308', shape: 'default' } },
        { id: 'auth', type: 'custom', position: { x: 420, y: 40 }, data: { label: 'Auth Service', color: '#0891b2', shape: 'default' } },
        { id: 'api', type: 'custom', position: { x: 420, y: 150 }, data: { label: 'API Service', color: '#6366f1', shape: 'default' } },
        { id: 'worker', type: 'custom', position: { x: 420, y: 260 }, data: { label: 'Worker Service', color: '#7c3aed', shape: 'default' } },
        { id: 'db', type: 'custom', position: { x: 660, y: 100 }, data: { label: 'Database', color: '#0e7490', shape: 'database' } },
        { id: 'storage', type: 'custom', position: { x: 660, y: 230 }, data: { label: 'Object Storage', color: '#dc2626', shape: 'database' } },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 'lb' },
        { id: 'e2', source: 'lb', target: 'auth', animated: true },
        { id: 'e3', source: 'lb', target: 'api', animated: true },
        { id: 'e4', source: 'lb', target: 'worker', animated: true },
        { id: 'e5', source: 'api', target: 'db', style: { strokeDasharray: '6 4' } },
        { id: 'e6', source: 'auth', target: 'db', style: { strokeDasharray: '6 4' } },
        { id: 'e7', source: 'worker', target: 'storage' },
      ],
    },
    // Variant C — Clustered
    {
      label: 'Clustered Zones',
      nodes: [
        { id: 'gw', type: 'custom', position: { x: 280, y: 0 }, data: { label: 'API Gateway', color: '#6366f1', shape: 'rounded' } },
        { id: 'auth', type: 'custom', position: { x: 80, y: 130 }, data: { label: 'Auth', color: '#0891b2', shape: 'default' } },
        { id: 'user', type: 'custom', position: { x: 280, y: 130 }, data: { label: 'Users', color: '#0891b2', shape: 'default' } },
        { id: 'order', type: 'custom', position: { x: 480, y: 130 }, data: { label: 'Orders', color: '#0891b2', shape: 'default' } },
        { id: 'notify', type: 'custom', position: { x: 680, y: 130 }, data: { label: 'Notifications', color: '#f59e0b', shape: 'default' } },
        { id: 'db1', type: 'custom', position: { x: 180, y: 280 }, data: { label: 'Users DB', color: '#0e7490', shape: 'database' } },
        { id: 'db2', type: 'custom', position: { x: 480, y: 280 }, data: { label: 'Orders DB', color: '#0e7490', shape: 'database' } },
      ],
      edges: [
        { id: 'e1', source: 'gw', target: 'auth', animated: true },
        { id: 'e2', source: 'gw', target: 'user', animated: true },
        { id: 'e3', source: 'gw', target: 'order', animated: true },
        { id: 'e4', source: 'order', target: 'notify' },
        { id: 'e5', source: 'user', target: 'db1', style: { strokeDasharray: '6 4' } },
        { id: 'e6', source: 'auth', target: 'db1', style: { strokeDasharray: '6 4' } },
        { id: 'e7', source: 'order', target: 'db2', style: { strokeDasharray: '6 4' } },
      ],
    },
  ],

  flow: [
    {
      label: 'Linear Flow',
      nodes: [
        { id: 'start', type: 'custom', position: { x: 280, y: 0 }, data: { label: 'Start', color: '#22c55e', shape: 'rounded' } },
        { id: 'input', type: 'custom', position: { x: 280, y: 100 }, data: { label: 'User Input', color: '#6366f1', shape: 'default' } },
        { id: 'validate', type: 'custom', position: { x: 280, y: 200 }, data: { label: 'Validate', color: '#eab308', shape: 'diamond' } },
        { id: 'process', type: 'custom', position: { x: 280, y: 310 }, data: { label: 'Process Data', color: '#0891b2', shape: 'default' } },
        { id: 'error', type: 'custom', position: { x: 520, y: 200 }, data: { label: 'Show Error', color: '#ef4444', shape: 'default' } },
        { id: 'end', type: 'custom', position: { x: 280, y: 420 }, data: { label: 'Complete', color: '#22c55e', shape: 'rounded' } },
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'input' },
        { id: 'e2', source: 'input', target: 'validate' },
        { id: 'e3', source: 'validate', target: 'process', label: 'Valid' },
        { id: 'e4', source: 'validate', target: 'error', label: 'Invalid' },
        { id: 'e5', source: 'process', target: 'end' },
        { id: 'e6', source: 'error', target: 'input', style: { strokeDasharray: '6 4' } },
      ],
    },
    {
      label: 'Branching Flow',
      nodes: [
        { id: 'start', type: 'custom', position: { x: 280, y: 0 }, data: { label: 'Start', color: '#22c55e', shape: 'rounded' } },
        { id: 'check', type: 'custom', position: { x: 280, y: 110 }, data: { label: 'Check Type', color: '#eab308', shape: 'diamond' } },
        { id: 'pathA', type: 'custom', position: { x: 80, y: 230 }, data: { label: 'Path A', color: '#6366f1', shape: 'default' } },
        { id: 'pathB', type: 'custom', position: { x: 280, y: 230 }, data: { label: 'Path B', color: '#0891b2', shape: 'default' } },
        { id: 'pathC', type: 'custom', position: { x: 480, y: 230 }, data: { label: 'Path C', color: '#7c3aed', shape: 'default' } },
        { id: 'merge', type: 'custom', position: { x: 280, y: 350 }, data: { label: 'Merge', color: '#f59e0b', shape: 'default' } },
        { id: 'end', type: 'custom', position: { x: 280, y: 450 }, data: { label: 'End', color: '#22c55e', shape: 'rounded' } },
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'check' },
        { id: 'e2', source: 'check', target: 'pathA', label: 'A' },
        { id: 'e3', source: 'check', target: 'pathB', label: 'B' },
        { id: 'e4', source: 'check', target: 'pathC', label: 'C' },
        { id: 'e5', source: 'pathA', target: 'merge' },
        { id: 'e6', source: 'pathB', target: 'merge' },
        { id: 'e7', source: 'pathC', target: 'merge' },
        { id: 'e8', source: 'merge', target: 'end' },
      ],
    },
  ],

  erd: [
    {
      label: 'Normalized Schema',
      nodes: [
        { id: 'users', type: 'custom', position: { x: 0, y: 0 }, data: { label: 'Users', color: '#6366f1', shape: 'table', fields: ['🔑 id', 'name', 'email', 'created_at'] } },
        { id: 'orders', type: 'custom', position: { x: 280, y: 0 }, data: { label: 'Orders', color: '#0891b2', shape: 'table', fields: ['🔑 id', '🔗 user_id', 'total', 'status'] } },
        { id: 'products', type: 'custom', position: { x: 560, y: 0 }, data: { label: 'Products', color: '#7c3aed', shape: 'table', fields: ['🔑 id', 'name', 'price', '🔗 category_id'] } },
        { id: 'categories', type: 'custom', position: { x: 560, y: 200 }, data: { label: 'Categories', color: '#f59e0b', shape: 'table', fields: ['🔑 id', 'name', 'slug'] } },
        { id: 'order_items', type: 'custom', position: { x: 280, y: 200 }, data: { label: 'Order Items', color: '#0e7490', shape: 'table', fields: ['🔑 id', '🔗 order_id', '🔗 product_id', 'qty'] } },
      ],
      edges: [
        { id: 'e1', source: 'users', target: 'orders', label: '1:N' },
        { id: 'e2', source: 'orders', target: 'order_items', label: '1:N' },
        { id: 'e3', source: 'products', target: 'order_items', label: '1:N' },
        { id: 'e4', source: 'categories', target: 'products', label: '1:N' },
      ],
    },
    {
      label: 'Denormalized Schema',
      nodes: [
        { id: 'users', type: 'custom', position: { x: 0, y: 80 }, data: { label: 'Users', color: '#6366f1', shape: 'table', fields: ['🔑 id', 'name', 'email'] } },
        { id: 'orders', type: 'custom', position: { x: 300, y: 0 }, data: { label: 'Orders', color: '#0891b2', shape: 'table', fields: ['🔑 id', '🔗 user_id', 'items[]', 'total'] } },
        { id: 'products', type: 'custom', position: { x: 300, y: 200 }, data: { label: 'Products', color: '#7c3aed', shape: 'table', fields: ['🔑 id', 'name', 'price', 'category'] } },
      ],
      edges: [
        { id: 'e1', source: 'users', target: 'orders', label: '1:N' },
        { id: 'e2', source: 'products', target: 'orders', label: 'N:M', style: { strokeDasharray: '6 4' } },
      ],
    },
  ],

  pipeline: [
    {
      label: 'CI/CD Pipeline',
      nodes: [
        { id: 'commit', type: 'custom', position: { x: 0, y: 130 }, data: { label: 'Git Commit', color: '#6366f1', shape: 'rounded' } },
        { id: 'build', type: 'custom', position: { x: 200, y: 130 }, data: { label: 'Build', color: '#0891b2', shape: 'default' } },
        { id: 'test', type: 'custom', position: { x: 400, y: 130 }, data: { label: 'Test', color: '#eab308', shape: 'default' } },
        { id: 'staging', type: 'custom', position: { x: 600, y: 60 }, data: { label: 'Staging', color: '#7c3aed', shape: 'default' } },
        { id: 'prod', type: 'custom', position: { x: 600, y: 200 }, data: { label: 'Production', color: '#22c55e', shape: 'default' } },
        { id: 'monitor', type: 'custom', position: { x: 800, y: 130 }, data: { label: 'Monitor', color: '#f59e0b', shape: 'rounded' } },
      ],
      edges: [
        { id: 'e1', source: 'commit', target: 'build', animated: true },
        { id: 'e2', source: 'build', target: 'test', animated: true },
        { id: 'e3', source: 'test', target: 'staging', label: 'Pass' },
        { id: 'e4', source: 'staging', target: 'prod', animated: true },
        { id: 'e5', source: 'test', target: 'prod', label: 'Hotfix', style: { strokeDasharray: '6 4' } },
        { id: 'e6', source: 'prod', target: 'monitor' },
      ],
    },
    {
      label: 'Multi-Stage Pipeline',
      nodes: [
        { id: 'src', type: 'custom', position: { x: 280, y: 0 }, data: { label: 'Source', color: '#6366f1', shape: 'rounded' } },
        { id: 'lint', type: 'custom', position: { x: 120, y: 110 }, data: { label: 'Lint', color: '#0891b2', shape: 'default' } },
        { id: 'build', type: 'custom', position: { x: 440, y: 110 }, data: { label: 'Build', color: '#0891b2', shape: 'default' } },
        { id: 'unit', type: 'custom', position: { x: 120, y: 220 }, data: { label: 'Unit Tests', color: '#eab308', shape: 'default' } },
        { id: 'integ', type: 'custom', position: { x: 440, y: 220 }, data: { label: 'Integration', color: '#eab308', shape: 'default' } },
        { id: 'deploy', type: 'custom', position: { x: 280, y: 330 }, data: { label: 'Deploy', color: '#22c55e', shape: 'rounded' } },
      ],
      edges: [
        { id: 'e1', source: 'src', target: 'lint' },
        { id: 'e2', source: 'src', target: 'build' },
        { id: 'e3', source: 'lint', target: 'unit' },
        { id: 'e4', source: 'build', target: 'integ' },
        { id: 'e5', source: 'unit', target: 'deploy', animated: true },
        { id: 'e6', source: 'integ', target: 'deploy', animated: true },
      ],
    },
  ],
}

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

// ── Thinking steps by template type ──

const THINKING_STEPS = {
  microservices: [
    'Analyzing prompt for system components...',
    'Identifying service boundaries and APIs...',
    'Extracting data stores and caching layers...',
    'Choosing top-down layout algorithm...',
    'Routing edges between services...',
    'Generating 3 layout variations...',
  ],
  flow: [
    'Parsing process steps from prompt...',
    'Identifying decision points and branches...',
    'Mapping start and end states...',
    'Applying flowchart layout rules...',
    'Generating 2 flow variations...',
  ],
  erd: [
    'Extracting entity names from prompt...',
    'Inferring relationships and cardinality...',
    'Defining primary and foreign keys...',
    'Arranging tables for readability...',
    'Generating 2 schema variations...',
  ],
  pipeline: [
    'Identifying pipeline stages...',
    'Mapping dependencies between stages...',
    'Adding monitoring and rollback points...',
    'Laying out horizontal pipeline flow...',
    'Generating 2 pipeline variations...',
  ],
}

// ── Core Service ──

function detectTemplateType(prompt) {
  const lower = prompt.toLowerCase()
  if (lower.includes('flow') || lower.includes('process') || lower.includes('step') || lower.includes('workflow'))
    return 'flow'
  if (lower.includes('erd') || lower.includes('table') || lower.includes('database') || lower.includes('entity') || lower.includes('schema'))
    return 'erd'
  if (lower.includes('pipeline') || lower.includes('ci/cd') || lower.includes('deploy') || lower.includes('build'))
    return 'pipeline'
  return 'microservices'
}

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

  // 3. Full generation with thinking steps
  const templateType = detectTemplateType(prompt)
  const steps = THINKING_STEPS[templateType] || THINKING_STEPS.microservices
  const variants = TEMPLATES[templateType] || TEMPLATES.microservices

  // Inject preferences context
  const prefs = usePreferencesStore.getState().getStyleSummary()
  const prefSteps = prefs
    ? [`Applying user preferences: ${prefs.summary}`]
    : []

  const allSteps = [...steps, ...prefSteps]

  // Stream thinking steps
  let stepIndex = 0
  const stepInterval = setInterval(() => {
    if (stepIndex < allSteps.length) {
      onThinkingStep?.(allSteps[stepIndex])
      stepIndex++
    } else {
      clearInterval(stepInterval)
      // Deliver variants after all steps complete
      setTimeout(() => {
        onComplete?.(variants, allSteps)
      }, 400)
    }
  }, 350 + Math.random() * 250)
}

export { parseEditCommand, detectTemplateType }

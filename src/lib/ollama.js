const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'glm-4.7-flash'

const GENERATE_SYSTEM_PROMPT = `You generate Mermaid.js diagrams.

Return ONLY valid JSON with this exact structure:
{
  "variants": [
    {
      "label": "Short descriptive label",
      "mermaid": "flowchart TD\\n  A[Start] --> B[End]"
    }
  ]
}

Rules:
1. Generate exactly 2 or 3 Mermaid variants.
2. Each variant must include a short "label" and a complete Mermaid diagram string in "mermaid".
3. Choose the Mermaid diagram type that best fits the request:
   - system architecture, pipeline, flowchart -> flowchart
   - sequence / interaction -> sequenceDiagram
   - ERD / database schema -> erDiagram
   - state machine -> stateDiagram-v2
   - class relationships -> classDiagram
4. Mermaid must be valid and self-contained.
5. Do not wrap Mermaid in markdown fences.
6. Prefer concise labels and readable node text.
7. For system architecture and pipelines, use "flowchart LR" or "flowchart TD".
8. For ERDs, use proper Mermaid "erDiagram" syntax.
9. For sequence diagrams, use proper Mermaid "sequenceDiagram" syntax.
10. Output JSON only. No prose before or after the JSON.`

const REVISE_SYSTEM_PROMPT = `You revise Mermaid.js diagrams.

Return ONLY valid JSON with this exact structure:
{
  "label": "Short descriptive label",
  "mermaid": "flowchart TD\\n  A[Start] --> B[End]"
}

Rules:
1. Keep the diagram in Mermaid syntax.
2. Apply the edit instruction to the supplied Mermaid while preserving the original intent.
3. Return exactly one revised diagram.
4. Mermaid must be valid and self-contained.
5. Do not wrap Mermaid in markdown fences.
6. Output JSON only. No prose before or after the JSON.`

function stripCodeFences(value) {
  return String(value || '')
    .replace(/^```(?:mermaid|json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

function looksLikeMermaid(text) {
  return /^(flowchart|graph|sequenceDiagram|classDiagram|erDiagram|stateDiagram-v2|journey|mindmap|timeline|gitGraph|pie|quadrantChart|requirementDiagram)\b/i.test(
    text.trim()
  )
}

function getResponseText(data) {
  let text = stripCodeFences(data.response || '')

  if (!text && data.thinking) {
    text = stripCodeFences(
      typeof data.thinking === 'string' ? data.thinking : JSON.stringify(data.thinking)
    )
  }

  if (!text) {
    throw new Error('Ollama returned an empty response. Please try a different prompt.')
  }

  return text
}

function parsePayload(text) {
  if (looksLikeMermaid(text)) {
    return { mermaid: text }
  }

  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {
        throw new Error(
          'Failed to parse Ollama response. The model did not return valid Mermaid JSON.'
        )
      }
    }

    throw new Error(
      'Failed to parse Ollama response. The model did not return valid Mermaid JSON.'
    )
  }
}

function normalizeVariants(parsed) {
  let variants

  if (Array.isArray(parsed)) {
    variants = parsed
  } else if (Array.isArray(parsed.variants)) {
    variants = parsed.variants
  } else if (typeof parsed.mermaid === 'string' || typeof parsed.code === 'string') {
    variants = [parsed]
  } else if (parsed.action) {
    throw new Error(
      `The model returned an unsupported action payload (${parsed.action}) instead of Mermaid diagram code.`
    )
  } else {
    throw new Error(
      'Unexpected response structure from Ollama. Expected Mermaid variants in JSON.'
    )
  }

  const normalized = variants
    .map((variant, index) => {
      const code = stripCodeFences(variant.mermaid || variant.code || variant.diagram || '')
      if (!code || !looksLikeMermaid(code)) return null

      return {
        id: variant.id || `variant-${index + 1}`,
        label: String(variant.label || `Variant ${index + 1}`).trim(),
        code,
      }
    })
    .filter(Boolean)

  if (normalized.length === 0) {
    throw new Error(
      'Ollama responded, but it did not return valid Mermaid diagram variants.'
    )
  }

  return normalized
}

async function requestOllama({ system, prompt }) {
  const baseUrl = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434'

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      system,
      prompt,
      stream: false,
      format: 'json',
      options: {
        temperature: 0.2,
      },
    }),
  })

  if (!response.ok) {
    const errBody = await response.text().catch(() => '')
    throw new Error(
      `Ollama request failed (${response.status}): ${errBody || response.statusText}. ` +
      `Make sure Ollama is running and the "${OLLAMA_MODEL}" model is pulled.`
    )
  }

  const data = await response.json()
  return parsePayload(getResponseText(data))
}

export async function generateDiagramVariants(userPrompt) {
  const parsed = await requestOllama({
    system: GENERATE_SYSTEM_PROMPT,
    prompt: userPrompt,
  })

  return normalizeVariants(parsed)
}

export async function reviseDiagramVariant(currentVariant, instruction) {
  const parsed = await requestOllama({
    system: REVISE_SYSTEM_PROMPT,
    prompt: [
      `Current diagram label: ${currentVariant.label || 'Untitled Diagram'}`,
      'Current Mermaid diagram:',
      currentVariant.code,
      '',
      `Edit instruction: ${instruction}`,
    ].join('\n'),
  })

  return normalizeVariants(parsed)[0]
}

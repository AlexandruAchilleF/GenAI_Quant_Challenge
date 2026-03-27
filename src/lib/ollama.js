const OLLAMA_MODEL = 'glm-4.7-flash'

const SYSTEM_PROMPT = `You are an AI diagram generator. You output ONLY valid JSON — no prose, no markdown, no explanations.

Your response must be a JSON object with this exact structure:
{
  "variants": [
    {
      "label": "Short descriptive label for this layout",
      "nodes": [
        {
          "id": "unique_id",
          "type": "custom",
          "position": { "x": 0, "y": 0 },
          "data": {
            "label": "Node Label",
            "color": "#hexcolor",
            "shape": "default"
          }
        }
      ],
      "edges": [
        {
          "id": "edge_id",
          "source": "source_node_id",
          "target": "target_node_id"
        }
      ]
    }
  ]
}

RULES:
1. Generate exactly 2 or 3 variants with different layouts or structural approaches.
2. Each variant must have a short, descriptive "label" (e.g., "Top-Down Architecture", "Left-to-Right Flow").
3. Node IDs must be short, unique, lowercase strings (e.g., "auth", "db", "gw").
4. Positions: Space nodes so they don't overlap. Use increments of ~200px for x, ~140px for y.
5. Valid shapes: "default" (rectangle), "rounded" (pill), "diamond" (decision), "database" (cylinder), "table" (ERD table with fields).
6. For "table" shape, add a "fields" array to data: ["🔑 id", "name", "email"].
7. Colors: Use visually distinct hex colors. Good choices: "#c85a3a" (coral), "#0891b2" (teal), "#6366f1" (indigo), "#22c55e" (green), "#eab308" (amber), "#7c3aed" (purple), "#ef4444" (red), "#0e7490" (dark teal), "#dc2626" (crimson).
8. Edge IDs must be unique strings (e.g., "e1", "e2").
9. Optional edge properties: "label" (string), "animated" (boolean), "style" (object with "strokeDasharray").
10. Your entire response must be parseable as JSON. No text before or after the JSON.
11. Choose the most appropriate diagram structure based on the user's description:
    - System architecture → nodes with services, databases, caches, queues
    - Flowchart/process → nodes with start, steps, decisions, end
    - ERD/database → table-shaped nodes with fields
    - Pipeline → sequential stage nodes`

/**
 * Calls local Ollama to generate React Flow diagram JSON from a user prompt.
 *
 * @param {string} userPrompt — Natural language description of the diagram.
 * @returns {Promise<Array>} — Array of variant objects { label, nodes[], edges[] }.
 * @throws {Error} — If the API call fails or returns invalid data.
 */
export async function generateDiagramJSON(userPrompt) {
  const baseUrl = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434'

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
      stream: false,
      format: 'json',
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
  let text = (data.response || '').trim()

  if (!text) {
    throw new Error('Ollama returned an empty response. Please try a different prompt.')
  }

  // Strip markdown fences if present
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  // Parse JSON
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    // Try to extract JSON object from noisy output
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        parsed = JSON.parse(match[0])
      } catch {
        throw new Error('Failed to parse Ollama response as JSON. The model returned invalid data.')
      }
    } else {
      throw new Error('Failed to parse Ollama response as JSON. The model returned invalid data.')
    }
  }

  // Normalize: accept { variants: [...] } or a direct array
  let variants
  if (Array.isArray(parsed)) {
    variants = parsed
  } else if (parsed.variants && Array.isArray(parsed.variants)) {
    variants = parsed.variants
  } else if (parsed.nodes && Array.isArray(parsed.nodes)) {
    // Single variant returned as a flat object
    variants = [{ label: 'Generated Diagram', ...parsed }]
  } else {
    throw new Error('Unexpected response structure from Ollama. Expected { variants: [...] }.')
  }

  // Validate each variant has required fields
  for (const v of variants) {
    if (!v.nodes || !Array.isArray(v.nodes)) v.nodes = []
    if (!v.edges || !Array.isArray(v.edges)) v.edges = []
    if (!v.label) v.label = 'Variant'

    // Ensure each node has required fields
    v.nodes = v.nodes.map((n, i) => ({
      id: n.id || `node_${i}`,
      type: 'custom',
      position: n.position || { x: (i % 4) * 200, y: Math.floor(i / 4) * 140 },
      data: {
        label: n.data?.label || n.label || `Node ${i}`,
        color: n.data?.color || n.color || '#c85a3a',
        shape: n.data?.shape || n.shape || 'default',
        ...(n.data?.fields ? { fields: n.data.fields } : {}),
      },
    }))

    // Ensure each edge has required fields
    v.edges = v.edges.map((e, i) => ({
      id: e.id || `e${i}`,
      source: e.source,
      target: e.target,
      ...(e.label ? { label: e.label } : {}),
      ...(e.animated ? { animated: true } : {}),
      ...(e.style ? { style: e.style } : {}),
    })).filter((e) => e.source && e.target)
  }

  return variants
}

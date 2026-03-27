import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are a Mermaid.js diagram code generator. Your ONLY job is to output raw, valid Mermaid.js syntax.

STRICT RULES — FOLLOW EVERY ONE:
1. Output ONLY the Mermaid.js code. Nothing else.
2. Do NOT wrap the code in markdown code fences (no \`\`\`mermaid or \`\`\`).
3. Do NOT include any introductory text, explanations, or commentary.
4. Do NOT include any text before or after the Mermaid syntax.
5. The first line of your response MUST be a valid Mermaid diagram type declaration (e.g., "graph TD", "flowchart LR", "erDiagram", "sequenceDiagram", "classDiagram", "stateDiagram-v2", "mindmap", etc.).
6. Use descriptive but concise node labels.
7. Ensure the syntax is 100% valid and parseable by the Mermaid.js library.
8. For architecture diagrams, prefer "flowchart TD" or "flowchart LR".
9. For database schemas, use "erDiagram".
10. For process flows, use "flowchart TD".
11. For API interactions, use "sequenceDiagram".
12. Choose the most appropriate diagram type based on the user's description.

REMEMBER: Your entire response must be ONLY valid Mermaid.js code. No prose. No markdown. No backticks.`

/**
 * Calls the Gemini API to generate Mermaid.js diagram code from a user prompt.
 *
 * @param {string} userPrompt — The user's natural language description of the diagram.
 * @returns {Promise<string>} — Raw, cleaned Mermaid.js code.
 * @throws {Error} — If the API call fails or returns empty content.
 */
export async function generateMermaidDiagram(userPrompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      'Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.'
    )
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const result = await model.generateContent(userPrompt)
  const response = result.response
  let text = response.text()

  if (!text || text.trim().length === 0) {
    throw new Error('Gemini returned an empty response. Please try a different prompt.')
  }

  // Safety net: strip any residual markdown fences the model might have added
  text = text.trim()
  text = text.replace(/^```mermaid\s*/i, '')
  text = text.replace(/^```\s*/i, '')
  text = text.replace(/\s*```$/i, '')
  text = text.trim()

  return text
}

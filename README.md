# DiagramAI

DiagramAI is a Vite + React application for generating Mermaid diagrams from natural language prompts. It pairs a conversational editor with local Ollama inference, renders diagram variants in Mermaid.js, supports follow-up edit prompts, and includes a styled landing page with mock authentication and theme switching.


## Team members
App built for LSEG Bucharest - GenAI Quant Challenge. 

Chelu Radu Andrei - https://github.com/shers0a
Flueraru Alexandru Achille - https://github.com/AlexandruAchilleF
Gaina David - https://github.com/DavidVamaiotu
Rusanescu Gabriel - https://github.com/gabrielrusanescu

## What The App Does Today

- Generates 2-3 Mermaid variants from a user prompt through a local Ollama instance.
- Lets users refine an existing diagram with follow-up instructions such as rename, recolor, or remove actions.
- Renders the selected Mermaid variant directly in the editor and surfaces renderer errors when Mermaid syntax fails.
- Exports the active rendered diagram as an SVG file.
- Stores theme selection, liked diagrams, and authenticated mock user sessions in browser storage.
- Includes a landing page, editor workspace, auth modal, role badges, and a guest access path.

## Current Implementation Status

This repository is currently a frontend-first prototype with local AI integration.

- AI generation is implemented through the Ollama HTTP API.
- Authentication is mocked in the frontend with Zustand and `localStorage`.
- `supabase/schema.sql` is included as a backend/schema reference, but Supabase is not wired into the running app. 
- Diagram preferences are collected locally only.
- The codebase is optimized around Mermaid output, not React Flow node editing.

## Feature Overview

### Landing Experience

- Marketing landing page with hero, features, workflow explanation, examples, CTA, and footer.
- Theme switcher with `orange`, `blue`, and `emerald` palettes.
- Responsive navigation with login/logout state and role badges.

### Editor Workflow

- Split-pane editor with AI chat on the left and Mermaid preview on the right.
- Variant tabs to compare generated alternatives.
- Floating chat collapse/expand control.
- Thinking-step feedback while the model is generating or revising a diagram.
- Empty, loading, and render-error states for the canvas.

### AI Behavior

- Uses local Ollama generation with JSON-only prompting.
- Detects vague prompts and responds with clarifying questions.
- Supports iterative editing against the current diagram instead of always regenerating from scratch.
- Keeps the original variant when an edit prompt produces a revised version so the result can be compared.

### Persistence And Personalization

- Theme choice is persisted in browser storage.
- Liked diagrams and dislike counts are persisted through a Zustand persisted store.
- Mock authenticated users are persisted locally, while guest sessions are intentionally not persisted.

## Supported Diagram Flows

The current system prompt explicitly steers generation toward these Mermaid-friendly diagram families:

- Flowcharts and system architecture diagrams
- Sequence diagrams
- ER diagrams
- State diagrams
- Class diagrams

The Mermaid renderer can display additional Mermaid syntaxes if the model returns them, but the default prompt engineering is tuned around the list above.

## Demo Accounts

The app ships with mock frontend-only credentials in [`src/store/authStore.js`](src/store/authStore.js):

| Role | Email | Password |
| --- | --- | --- |
| Work | `work@diagramai.com` | `work123` |
| Normal | `user@diagramai.com` | `user123` |

You can also continue as a guest directly from the auth modal or the editor overlay.

## Local Development

### Prerequisites

- Node.js and npm
- A local Ollama installation running on your machine
- At least one Ollama model suitable for structured JSON output

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Ollama

Run Ollama locally. The app expects the Ollama HTTP API to be available at `http://localhost:11434` unless overridden.

If you want to use the same default model name configured in the app, pull it first:

```bash
ollama pull glm-4.7-flash
```

If you prefer another installed model, set `VITE_OLLAMA_MODEL` accordingly.

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=glm-4.7-flash
```

### 4. Start The App

```bash
npm run dev
```

Open `http://localhost:5173`.

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_OLLAMA_URL` | `http://localhost:11434` | Base URL for the local Ollama API |
| `VITE_OLLAMA_MODEL` | `glm-4.7-flash` | Model name sent to Ollama for diagram generation and revision |

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Produce a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## Prompting Tips

Good results come from prompts that specify the system shape, major components, and the desired diagram style.

Examples:

```text
Microservices architecture with API Gateway, Auth, Orders, Payments, Notifications, PostgreSQL, and Redis
```

```text
User authentication flow with email login, password validation, 2FA check, success, and retry on failure
```

```text
E-commerce ER diagram with users, orders, order_items, products, categories, and inventory
```

Follow-up edit prompts can be short and direct:

```text
rename API Gateway to BFF
remove Redis
change Payment Service to blue
```

## Project Structure

```text
src/
  components/
    AuthModal.jsx
    MermaidRenderer.jsx
    Navbar.jsx
    ThemeSwitcher.jsx
    editor/
      CanvasPane.jsx
      CanvasToolbar.jsx
      ChatPane.jsx
      VariantTabs.jsx
  lib/
    ollama.js
  pages/
    LandingPage.jsx
    EditorPage.jsx
  services/
    aiService.js
  store/
    authStore.js
    chatStore.js
    diagramStore.js
    preferencesStore.js
supabase/
  schema.sql
```

## Key Files

- [`src/lib/ollama.js`](src/lib/ollama.js): Ollama request layer, response parsing, and variant normalization.
- [`src/services/aiService.js`](src/services/aiService.js): orchestration for generation, revision, disambiguation, and thinking steps.
- [`src/pages/EditorPage.jsx`](src/pages/EditorPage.jsx): main editor shell, SVG export, role badge display, and auth overlay.
- [`src/components/editor/ChatPane.jsx`](src/components/editor/ChatPane.jsx): conversational workflow for prompt submission and follow-up edits.
- [`src/components/MermaidRenderer.jsx`](src/components/MermaidRenderer.jsx): Mermaid initialization, rendering, and syntax-error handling.
- [`src/store/authStore.js`](src/store/authStore.js): mock authentication and role persistence.
- [`supabase/schema.sql`](supabase/schema.sql): starter relational schema for a future backend-backed auth flow.

## Notes On Architecture

- The UI is built with React 19, React Router 7, Zustand, Tailwind CSS v4, and Lucide icons.
- Mermaid rendering is the final source of truth for the diagram preview and export flow.
- `reactflow` is installed, but the current editor is Mermaid-first and does not use a drag-and-drop node canvas.
- The app currently uses browser state and browser persistence heavily, so behavior is easiest to validate in a local browser session.

## Known Limitations

- Authentication is not backed by a real auth provider yet.
- Role-specific AI routing is not implemented in the current frontend, even though roles exist in the UI and schema notes.
- The landing page copy mentions broader sharing/export possibilities, but the implemented editor export path is SVG.
- There is no automated test suite yet; validation currently relies on linting and production builds.

## Verification

Before merging or shipping changes, run:

```bash
npm run lint
npm run build
```

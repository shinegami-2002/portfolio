# chatadi.sys — portfolio

Operator-console portfolio for Shanmukha Chatadi. Live at https://shanmukha-chatadi.vercel.app/

## Stack
- Vite + React 18 + TypeScript. No runtime deps beyond react/react-dom — springs, BM25 retrieval,
  and the WebGL signal shader are hand-rolled.
- Self-hosted variable fonts: Archivo (display/body) + Martian Mono (data/labels).
- Dual theme (graphite/paper) via CSS tokens; CRT power-cycle flip.

## The interesting parts
- `src/sims/` — five live simulations of real systems (HPA queue, LangGraph execution,
  live openFDA MCP calls, CKA heatmap, A2A mesh).
- `src/agent/` — client-side BM25 over a corpus derived from the content model; the ⌘K palette
  runs it with visible tool steps. No API, no tracking.
- `src/content/` — single typed source of truth for all copy.

## Develop
```bash
npm install
npm run dev      # local dev
npm test         # retrieval corpus tests
npm run build    # production build → dist/
```

Deploys automatically via Vercel on push to main; branches get preview URLs.

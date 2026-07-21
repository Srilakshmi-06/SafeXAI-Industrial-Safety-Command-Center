# SafeXAI — Industrial Safety Command Center

A **frontend-only** interactive prototype for an AI-Powered Industrial Safety Intelligence platform aimed at heavy industry in India. All data is mocked/static — there is no backend, database, or server logic.

## What it does

A unified safety operations dashboard that simulates a live industrial command center, monitoring:

- **Live Safety Command Center** — summary cards (active alerts, critical zones, open permits, workers at risk, compliance score, response time), risk trend chart, live alert feed.
- **Geospatial Risk Map** — custom SVG plant layout with heatmap halos, worker markers (PPE / SOS states), hazard icons, restricted zones, evacuation routes, and a clickable zone detail panel.
- **Compound Risk Panel** — AI-correlated multi-signal risks (hot work + rising gas, confined space + low oxygen, etc.) with severity, confidence, factors, suggested action, and explanation.
- **Permit Intelligence** — permit table with type/asset/zone/status/remaining/safety-checks/conflicts, filtering by type and severity, and unsafe simultaneous-operation flags.
- **CCTV Safety Events** — event cards with camera tiles, scanline thumbnails, severity, confidence, and a detail modal.
- **Incident Intelligence** — historical incidents, pattern summaries, similar-incidents panel, AI cause/prevention explanation.
- **Compliance Dashboard** — progress rings and bars for permit validation, gas test logs, isolation verification, inspection completion, audit readiness; missing records table.
- **Emergency Response Workflow** — critical alert modal with step-by-step status chips (notify supervisor → freeze permit → dispatch → evacuate → preserve evidence → generate report).
- **Natural-Language Safety Copilot** — chat assistant with preloaded prompts and context-aware mock answers, plus a context side panel and floating dock button.

## Tech stack

- React + Vite + TypeScript
- Tailwind CSS (custom dark industrial theme)
- Framer Motion (animations & micro-interactions)
- Recharts (charts)
- Lucide React (icons)
- Local mock JSON data (`src/data/mock.ts`)

## Project structure

```
src/
  data/mock.ts            # all mock data (zones, permits, workers, events, incidents, compliance)
  lib/theme.ts            # severity color helpers
  components/
    ui.tsx                # reusable primitives (Card, Ring, ProgressBar, badges, chips, skeletons)
    Shell.tsx             # sidebar nav + topbar + live clock
    Overview.tsx          # command center dashboard
    RiskMap.tsx            # SVG geospatial risk map + side panel
    Permits.tsx           # permit intelligence table
    CCTV.tsx              # CCTV event grid + modal
    Incidents.tsx         # incident intelligence + AI cause box
    Compliance.tsx        # compliance rings + overdue table
    EmergencyModal.tsx    # emergency response workflow modal
    Copilot.tsx           # AI chat copilot + floating dock
  App.tsx                 # view router / layout
  index.css               # global styles (glassmorphism, grid, scanlines, shimmer)
```

## Run locally

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run typecheck
```

The dev server runs automatically in this environment — open the preview URL to view the app.

## Notes

- This is a hackathon-ready UI prototype. All telemetry, alerts, gas readings, permits, CCTV events and incidents are simulated in `src/data/mock.ts`.
- The Emergency button in the top bar triggers the response workflow modal with animated step progression.
- The floating copilot button (bottom-right) opens the AI Safety Copilot view.
- Fully responsive: sidebar collapses to a drawer on mobile.

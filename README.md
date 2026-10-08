# DareAI Search Intelligence Dashboard

Production-style frontend project built to match the DareAISearch Front-End Developer JD.

## Highlights
- React + TypeScript + Vite
- Responsive dashboard UI
- TanStack Query for async fetching and caching
- Loading, error, empty and retry states
- Optimistic prompt tracking
- Search, filters and deletion
- Accessible labels and semantic controls
- Recharts analytics
- Zustand UI state
- Vitest / Playwright-ready scripts
- No API keys required; mock API is included

## Run

```bash
npm install
npm run dev
```

Open the local Vite URL.

## Build

```bash
npm run build
```

## Project pages
- Overview
- Prompts
- Platforms
- Competitors
- Settings

## Git

```bash
git init
git add .
git commit -m "feat: build AI search visibility dashboard"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Notes
The data layer is intentionally isolated in `src/services/api.ts`, so a real backend can replace the mock functions without changing the UI architecture.

## Functional interaction coverage

The dashboard includes working frontend interactions for competitor search/filtering, adding a competitor through a modal, workspace profile editing, notification and retention controls, security settings, and a responsive mobile navigation drawer. These are local frontend/demo state interactions; connect them to backend endpoints when real persistence/authentication is available.

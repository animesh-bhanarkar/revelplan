# PROJECT_STATE.md — RevelPlan
> Edited ONLY by Claude. Read-only for Antigravity.

## What this is
GenAI Celebration & Event Planner for PromptWars Challenge 5 (Hack2skill x Google).
Deadline: Sun Nov 01 2026, 11:59 PM IST. Hard submit target: 11:00 PM IST.

## Key decisions (locked)
- Name: RevelPlan
- Persona: one person planning a wedding, birthday, or community event in India on a budget
- Stack: Node + Express, Vanilla HTML + Tailwind CDN, node:test, helmet, express-rate-limit
- Engine: event type x guest count x budget tier x city tier → budget split + timeline + vendor checklist
- AI edges: Gemini for intake JSON + ideas + streaming chat (SSE)
- Google: Gemini API + Places API (New, server-side) + Cloud Run
- Repo: github.com/animesh-bhanarkar/revelplan (public, single branch: main)
- Cloud project: revelplan-pw5 (dedicated)
- Local port: 8090

## Canonical values (fill as confirmed)
- Gemini model ID: [ TBD — confirm via ListModels ]
- Cloud Run service name: revelplan
- Cloud Run region: asia-south1

## Status log
- [ ] 0  Manual setup (user) — Cloud project, APIs enabled, keys created, billing alert, repo created, local folder, .env written
- [ ] 1  Context + state files committed, git init, .gitignore (UTF-8)
- [ ] 2  Scaffold — server.js, health endpoint, static homepage served
- [ ] 3  budgetEngine.js + tests
- [ ] 4  timelineEngine.js + tests
- [ ] 5  vendorChecklist.js + tests
- [ ] 6  Gemini intake + ideas endpoint (mocked tests)
- [ ] 7  Real Gemini model confirmed + live endpoint verified
- [ ] 8  Places API vendor discovery endpoint (server-side)
- [ ] 9  FIRST Cloud Run deploy — live URL confirmed working
- [ ] 10 Frontend — full UI with Tailwind, connected to all endpoints
- [ ] 11 Streaming chat (SSE) endpoint + wired to frontend
- [ ] 12 Security pass (helmet headers, rate limits, input validation confirmed)
- [ ] 13 Accessibility pass (ARIA, keyboard nav, color contrast, reduced motion)
- [ ] 14 README with rubric-named sections
- [ ] 15 Final deploy + smoke test every endpoint + live URL verified
- [ ] 16 Submit + monitor live URL until results

## Next step
Step 0: User completes manual setup (see PROJECT_CONTEXT.md roles section and
the manual checklist Claude provided). Report back: IST time, Gemini model ID
from ListModels, confirmation all setup steps done.
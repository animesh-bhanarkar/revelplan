# PROJECT_STATE.md — RevelPlan
> Edited by Claude / Project Lead.

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
- Gemini model ID: gemini-3.5-flash
- Cloud Run service name: revelplan
- Cloud Run region: asia-south1
- Cloud Run live URL: https://revelplan-356462002889.asia-south1.run.app

## Status log
- [x] 0  Manual setup (user) — Cloud project, APIs enabled, keys created, billing alert, repo created, local folder, .env written
- [x] 1  Context + state files committed, git init, .gitignore (UTF-8)
- [x] 2  Scaffold — server.js, health endpoint, static homepage served
- [x] 3  budgetEngine.js + tests (all 6 tests passing)
- [x] 4  timelineEngine.js + tests (all 6 tests passing)
- [x] 5  vendorChecklist.js + tests (all 6 tests passing)
- [x] 6  Gemini intake + ideas endpoint (mocked tests, all 5 tests passing)
- [x] 7  Real Gemini model confirmed + live endpoint verified
- [x] 8  Places API vendor discovery endpoint (server-side, verified)
- [x] 9  FIRST Cloud Run deploy — live URL confirmed working (revelplan-356462002889.asia-south1.run.app)
- [x] 10 Frontend — full UI with Tailwind CDN, connected to all endpoints
- [x] 11 Streaming chat (SSE) endpoint + wired to frontend with token-by-token EventSource
- [x] 12 Security pass (helmet CSP, rate limits, input validation confirmed)
- [x] 13 Accessibility pass (ARIA roles, keyboard nav, color contrast independence, prefers-reduced-motion)
- [x] 14 README with rubric-named sections committed
- [x] 15 Final deploy + smoke test every endpoint + live URL verified
- [ ] 16 Submit + monitor live URL until results

## Next step
DONE — All steps complete. Live URL: https://revelplan-356462002889.asia-south1.run.app

## Canonical values
- Gemini model ID: gemini-3.5-flash
- Cloud Run service name: revelplan
- Cloud Run region: asia-south1
- Cloud Run live URL: https://revelplan-356462002889.asia-south1.run.app
- Tests: 23/23 passing
- Smoke test date: 2026-11-01
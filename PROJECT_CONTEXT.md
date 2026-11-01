# PROJECT_CONTEXT.md — RevelPlan (PromptWars Challenge 5)

## Project Identity
- Name: RevelPlan
- Challenge: PromptWars Challenge 5 — Celebration & Event Planner
- Organizer: Google for Developers x Hack2skill
- Deadline: Sun Nov 01 2026, 11:59 PM IST | Hard submit target: 11:00 PM IST
- Repo: github.com/animesh-bhanarkar/revelplan (public, single branch: main)
- Cloud project: revelplan-pw5 (dedicated, fresh quota)
- Local folder: C:\Users\anime\OneDrive\Desktop\Challenge 5
- Local port: 8090

## Roles
- Claude: architect, prompt-writer, PM. The ONLY editor of PROJECT_STATE.md.
- Antigravity: developer agent. Edits code, runs commands, reports verbatim output.
- User (Ani): relay and verifier. Reproduces every "it works" claim in his own terminal before reporting back.

## What RevelPlan does
A GenAI-powered celebration and event planning assistant for weddings, birthdays,
and community events in India. It produces:
- Budget split (deterministic, by event type + guest count + budget tier + city tier)
- Backward timeline from the event date
- Vendor checklist by event type
- Personalized ideas (Gemini)
- Vendor discovery by city (Places API New)
- Chat assistant (Gemini, streaming via SSE)

## Architecture (locked — do not change without Claude's instruction)
- Backend: Node.js + Express
- Frontend: Vanilla HTML + Tailwind CSS (CDN play script, no build step)
- Testing: node:test (built-in, zero dependencies)
- Security: helmet + express-rate-limit
- AI: Gemini API — structured intake (JSON) + streaming chat (SSE)
- Maps: Places API (New), server-side only. Client sends city + vendor category; server returns results. Client never sees keys or raw coordinates.
- Hosting: Google Cloud Run (source deploy)
- No database — event plans live in server memory per session

## Engine (deterministic core — pure functions, no AI, unit tested)
- budgetEngine.js: event type x guest count x budget tier x city tier → budget split object
- timelineEngine.js: event type x event date → array of milestones with dates
- vendorChecklist.js: event type → categorized vendor list with priority flags
- All AI output must be validated against engine's own enums before use

## Google Services used
1. Gemini API — intake parsing + ideas generation + chat assistant
2. Places API (New) — real vendor discovery (server-side)
3. Cloud Run — hosting

## Tech decisions — what we are NOT using and why
- No React/Vue: build step wastes time; CDN versions are fragile
- No database: adds crash surface, not needed for this scope
- No Socket.io: SSE handles streaming; fewer dependencies
- No Firebase: adds auth complexity and billing surface

## Do's for Antigravity
- Do exactly ONE task per prompt; report verbatim terminal output
- Do build tests, security and accessibility into every step — not at the end
- Do mock all external APIs in tests (Gemini, Places)
- Do use .env for secrets; write .env.example with placeholder names only
- Do make the server start and serve the homepage even when API keys are missing
- Do disable only the affected feature with a graceful UI message on key failure
- Do NOT crash the entire process for a missing key
- Do check installed package source/docs instead of assuming API shapes
- Do read process.env.PORT in server.js (Cloud Run injects this)
- Do use port 8090 locally

## Don'ts for Antigravity
- Do NOT edit PROJECT_STATE.md or PROJECT_CONTEXT.md
- Do NOT touch files outside the prompt's stated scope
- Do NOT print, log, or commit secrets
- Do NOT claim success without showing real terminal output
- Do NOT invent or fabricate test results — show actual output
- Do NOT add unrequested features, dependencies, or refactors
- Do NOT retry a failing command blindly — stop and report the exact error text

## Session recovery (after account switch)
1. Read PROJECT_CONTEXT.md (this file) fully
2. Read PROJECT_STATE.md fully
3. Inspect actual repo files to ground yourself
4. Wait for the next prompt from Claude via Ani — do not act on your own
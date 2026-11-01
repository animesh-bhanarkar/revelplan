# RevelPlan — AI-Powered Celebration & Event Planner

## Project Overview
RevelPlan is a GenAI-powered celebration and event planning assistant designed specifically for weddings, birthdays, and community gatherings in India. Built for **PromptWars Challenge 5 — Celebration & Event Planner** (organized by Google for Developers x Hack2skill), RevelPlan blends deterministic mathematical engines (for budget breakdowns, milestone timelines, and vendor checklists) with Google Gemini AI and Google Places API to deliver actionable, culturally attuned event roadmaps in seconds.

---

## Google Technologies Used
1. **Gemini API (`gemini-3.5-flash`)**:
   - Structured event intake extraction from free-form user descriptions.
   - Culturally tailored creative recommendations and budget-saving ideas for Indian celebrations.
   - Real-time conversational planning assistant streaming via Server-Sent Events (SSE).
2. **Google Places API (New)**:
   - Server-side Text Search (`/v1/places:searchText`) discovering real, verified venues and catering services in any Indian city.
   - Client privacy preserved: API keys, raw coordinates, and backend tokens never exposed to the browser.
3. **Google Cloud Run**:
   - Containerized hosting on scalable serverless infrastructure deployed in `asia-south1` (Mumbai).
4. **Cloud Build & Artifact Registry**:
   - Automated container image compilation and artifact management for continuous deployment.

---

## Architecture
- **Backend**: Node.js & Express with security hardening (`helmet` Content Security Policy and `express-rate-limit` DDoS/brute-force throttling).
- **Deterministic Core**: Pure functions with zero AI hallucination risk:
  - `budgetEngine.js`: Event type × guest count × budget tier × city tier → exact ₹ budget split and per-head costs.
  - `timelineEngine.js`: Event type × event date → chronological backward milestone dates and priorities.
  - `vendorChecklist.js`: Event type → categorized vendor booking checklist with priority badges.
- **AI Integration**: `@google/generative-ai` with automated JSON markdown fence stripping, syntax repair, and fallback handling.
- **Maps Discovery**: Server-side proxy for Places API (New) returning curated venue listings.
- **Real-Time Streaming**: Server-Sent Events (`text/event-stream`) delivering token-by-token chat responses via browser `EventSource`.
- **Frontend**: Responsive Single Page Application using vanilla HTML5 and Tailwind CSS (CDN play script, zero build step) with Google Font *Poppins*.
- **Data Persistence**: In-memory session model — zero database dependency for near-zero crash surface.

---

## Features
- **Natural Language Intake**: Describe celebrations in plain English (e.g. *"Wedding for 150 guests in Pune, mid budget, March 2027"*) and automatically extract structured parameters.
- **Deterministic Budget Calculator**: Calculates total budget, per-head expense, and category allocations (venue, catering, decoration, photography, entertainment, logistics) calibrated to Indian tier-1/2/3 cities.
- **Backward Milestone Timeline**: Computes backward planning checkpoints from the celebration date (e.g. 180 days to 1 day prior) sorted chronologically.
- **Vendor Checklist**: Categorized requirements (Essential, Recommended, Optional) with actionable booking lead times.
- **AI-Generated Creative Concepts**: 5 bespoke, budget-conscious ideas tailored to Indian cultural contexts.
- **Nearby Vendor Discovery**: Live Google Places API lookup for rated venues and catering services in the designated city.
- **Interactive AI Chat Assistant**: Floating streaming chat interface offering real-time budgeting advice and vendor negotiation guidance.

---

## Setup & Installation

### Prerequisites
- Node.js 20+ installed
- Active Google Cloud project with Gemini API and Places API (New) enabled

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/animesh-bhanarkar/revelplan.git
   cd revelplan
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your actual API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PLACES_API_KEY=your_places_api_key_here
   GEMINI_MODEL=gemini-3.5-flash
   PORT=8090
   ```
4. Start the server:
   ```bash
   node server.js
   ```
5. Open your browser and navigate to:
   ```text
   http://localhost:8090
   ```

---

## Environment Variables
The application reads the following configuration variables from `.env` (or Cloud Run environment):

| Variable | Description | Default / Example |
|---|---|---|
| `GEMINI_API_KEY` | API key for Google Gemini Generative Language API | *Required for AI features* |
| `PLACES_API_KEY` | Google Cloud API key with Places API (New) enabled | *Required for vendor discovery* |
| `GEMINI_MODEL` | Gemini model identifier | `gemini-3.5-flash` |
| `PORT` | Local and production web server port | `8090` (local) / `8080` (Cloud Run) |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check endpoint returning `{ "status": "ok" }`. |
| `POST` | `/api/intake` | Extracts structured event parameters (`eventType`, `guestCount`, `budgetTier`, `cityTier`, `city`, `eventDate`) from natural language. |
| `POST` | `/api/budget` | Computes deterministic budget split, total ₹ cost, and per-head rate. |
| `POST` | `/api/timeline` | Generates chronological backward milestones and priority badges from event date. |
| `GET` | `/api/vendors/:eventType` | Returns categorized vendor requirements and planning notes for `wedding`, `birthday`, or `community`. |
| `POST` | `/api/ideas` | Generates 5 unique, budget-tailored creative concepts for India via Gemini. |
| `GET` | `/api/places` | Discovers verified nearby venues and vendors via Places API (New) query params (`city`, `category`). |
| `GET` | `/api/chat` | Real-time streaming celebration advice via Server-Sent Events (`text/event-stream`). |

---

## Running Tests
RevelPlan uses the built-in Node.js test runner (`node:test` and `node:assert/strict`) with zero external dependencies and mocked external APIs:

```bash
node --test
```

Run individual test suites:
```bash
node --test tests/budgetEngine.test.js
node --test tests/timelineEngine.test.js
node --test tests/vendorChecklist.test.js
node --test tests/geminiService.test.js
```

---

## Deployment

Deploy directly from source to Google Cloud Run:

```bash
gcloud run deploy revelplan \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="YOUR_KEY",PLACES_API_KEY="YOUR_KEY",GEMINI_MODEL="gemini-3.5-flash"
```

---

## Live Demo
🚀 **Production URL**: [https://revelplan-356462002889.asia-south1.run.app](https://revelplan-356462002889.asia-south1.run.app)

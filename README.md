# PAT AI Assistant + Build Dashboard

PAT is a clean, minimalist, ChatGPT-style AI assistant designed to learn from user habits, workflow, and communication patterns.

## Product Principles
- Black and white UI only.
- No emoji in interface copy.
- Minimal, concise responses.
- Honest about limitations.
- Companion-like communication style.

## Core Capabilities
- Smart planner for projects and execution.
- Background learning from recurring topics and behavior.
- Voice support (Mistral default).
- Photo/image understanding.
- Google Drive processing.
- Email triage + draft generation.
- CRM + campaign workflow support.
- Botspace integration for marketing learning loops.

## Learning Model (Subtle + Data-Driven)
PAT learns quietly by:
- Logging lookup topics and repeated intents.
- Connecting patterns across conversations, files, and outcomes.
- Researching online when needed.
- Recording decision + outcome pairs to improve future suggestions.

## Communication and Decision UX
- Button-first interaction for yes/no or multiple-choice prompts.
- Card-based decision UI with:
  - pros and cons,
  - probability estimate,
  - expected outcome,
  - recommended next steps.
- Cards should support expansion for detail (Pinterest-style interaction model).

## Email Behavior Goals
- Identify messages that need replies vs. no-reply/promotional/system mail.
- Auto-create draft replies only when a response is needed.
- Prompt with a clear binary question: “Would you like me to reply to this?”

## Tech Stack
- Frontend: Next.js + React (Vercel)
- Backend: Flask (Python)
- Database/memory: Supabase
- Voice: Mistral
- Models/APIs: Mistral, Groq, Gemini (round-robin), Botspace API

## Build Dashboard
`BuildDashboard.jsx` is a ready-to-wire React dashboard that includes:
- Track cards (A/B/C/D/E/F/G + KB)
- Dependencies and fallback paths
- Build steps per track
- Deployment sequence
- Expandable decision cards with probabilities and next actions

### Current Track Set
- A: Supabase Memory Migration
- KB: Knowledge Base
- B: Vector Learning
- C: Data Processing Engine
- D: Email Marketing System
- E: Vercel Frontend
- F: Email Identity (Resend)
- G: Domain + DNS Management

## Deployment Order (Target: espacios.me)
1. Finish Phase 0 and Phase 1, including KB.
2. Update ECS Nginx for `/api/*` and `/api/memory`.
3. Deploy frontend to Vercel at `pat.espacios.me`.
4. Point Cloudflare CNAME to Vercel.
5. Restart container (`docker restart void-aether-app`).
6. Run end-to-end tests on `https://espacios.me`.

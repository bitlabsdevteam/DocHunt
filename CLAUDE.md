# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Important

Read **PRD.md**,**AGENTS.MD**, and **TDD.md** before making any changes. They define what to build and how to test it.

## Guardrails for Code Generation

- **Never generate code that asks for or stores PII** (names, addresses, IDs, payment info). See PRD.md § Guardrails.
- **No dashboard or SaaS UI** — all features must live in the chat interface.
- **Search responses must be JSON** — parse Perplexity API output into structured objects before rendering.

## Development Commands

- **Install deps**: `npm install`
- **Dev server**: `npm run dev`
- **Frontend only**: `npm run dev:frontend`
- **Backend only**: `npm run dev:backend`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Test**: `npm test`
- **Docker**: `docker compose up --build`

## Conventions

- TypeScript strict mode — no `any` types.
- Agent logic lives under `backend/src/agents/`; each agent node gets its own file.
- Guardrail checks are LangGraph nodes that run on every turn before other processing.
- Environment variables go in `.env` (see `.env.example`). Never commit secrets.
- Docker Compose for local full-stack. Vercel for frontend deployment.

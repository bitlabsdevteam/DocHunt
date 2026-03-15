# PRD — Japan Hospital Finder Agent

## Problem

Hospitals and clinics in Japan prioritize patients based on symptoms and real-time availability. Parents and individuals often struggle to locate an open, nearby facility during emergencies.

## Solution

A multi-agentic chat solution that helps patients find available hospitals and clinics in Japan. The architecture borrows selectively from the OpenClaw pattern — adopting its multi-agent orchestration ideas without replicating the full framework.

**THIS IS NOT A DASHBOARD OR SAAS PRODUCT.** This is a conversational agentic solution. The UI must be chat-first — no admin panels, no dashboard widgets, no SaaS-style layouts.

The agent:

1. Accepts the user's symptoms and location.
2. Searches for the nearest hospitals/clinics with current availability using **Perplexity API** as the primary search engine.
3. Returns search results as **structured JSON** and renders them in a **user-friendly format** in the chat UI (cards, lists, maps — not raw JSON).
4. Comforts and guides the user through the process.
5. Assists with making a reservation when possible.

## Architecture

- **Multi-agent orchestration** inspired by OpenClaw — agents are composed via LangGraph, each responsible for a distinct concern (triage, search, booking, guardrail enforcement).
- **Tools, Skills, and MCP** — agents use MCP (Model Context Protocol) servers, tools, and skills to interact with external services and perform actions.
- **Search** — Perplexity API is the primary search backend. All search responses must be structured as JSON before being rendered to the user.
- **Frontend** — React (TypeScript), chat-centric UI. Containerised with Docker. Vercel-ready.
- **Backend API** — TypeScript, containerised with Docker.
- **Database** — Supabase (Postgres + real-time + auth).
- **Agent framework** — LangChain + LangGraph.
- **LLM** — OpenAI GPT-5.4.

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Frontend**: React (chat UI, not a dashboard)
- **Database**: Supabase
- **Containerisation**: Docker (frontend + backend API)
- **Agent Framework**: LangChain + LangGraph
- **LLM**: OpenAI GPT-5.4
- **Search**: Perplexity API
- **Agent Integration**: Tools, Skills, MCP servers
- **Deployment**: Vercel-compatible

## Critical Design Rules

- **No dashboard UI** — every interaction flows through the conversational interface.
- **Search results as JSON** — all Perplexity API responses must be structured JSON, then rendered in a user-friendly way (cards, lists, etc.) within the chat.
- **Vercel-deployable** — project structure, build output, and config must support straightforward Vercel deployment.

## Guardrails & Security Constraints

These rules are **non-negotiable**:

1. **Never ask for or accept personal information** — the agent must not request names, addresses, phone numbers, government IDs, or any PII beyond what is strictly needed for symptom assessment and location lookup.
2. **Never ask for or accept payment / credit-card information** — all payment flows, if any, must be handled outside the chat agent through a secure, dedicated channel.
3. **Warn and reject** — if a user volunteers personal or payment information, the agent must immediately warn them not to share such data and must **not** store or forward it.

## Roadmap

- **Phase 1** (current): Chat-based hospital/clinic finder.
- **Phase 2**: Voice agent support — architecture must remain extensible for voice input/output.

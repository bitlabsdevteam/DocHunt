# DocHunt — Japan Hospital Finder Agent

A multi-agentic chat solution that helps patients find available hospitals and clinics in Japan. Users describe their symptoms and location, and the agent searches for nearby facilities with current availability using the Perplexity API, returning structured results in a conversational interface.

## How It Works

1. User describes symptoms and location in the chat.
2. A triage agent assesses urgency.
3. A search agent queries Perplexity API for nearby hospitals/clinics with availability.
4. Results are returned as structured JSON and rendered as user-friendly cards/lists in the chat.
5. The agent can assist with making a reservation when possible.

## Architecture

- **Multi-agent orchestration** via LangChain + LangGraph — agents handle triage, search, booking, and guardrail enforcement.
- **Tools, Skills, and MCP** — agents use MCP (Model Context Protocol) servers to interact with external services.
- **Chat-first UI** — React (TypeScript). No dashboard or admin panels.
- **Backend API** — TypeScript, containerised with Docker.
- **Database** — Supabase (Postgres + real-time + auth).
- **LLM** — OpenAI GPT-5.4.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript (strict mode) |
| Frontend | React (chat UI) |
| Backend | Node.js / Express |
| Database | Supabase |
| Agent Framework | LangChain + LangGraph |
| LLM | OpenAI GPT-5.4 |
| Search | Perplexity API |
| Containerisation | Docker |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- API keys for OpenAI, Perplexity, and Supabase

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd DocHunt

# Copy environment variables
cp .env.example .env
# Fill in your API keys in .env

# Install dependencies
npm install

# Start the dev server (frontend + backend)
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key |
| `PERPLEXITY_API_KEY` | Perplexity search API key |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `PORT` | Backend server port (default: 3001) |

### Development Commands

```bash
npm run dev           # Full-stack dev server
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
npm run build         # Production build
npm run lint          # Lint
npm test              # Run tests
docker compose up --build  # Run with Docker
```

## Project Structure

```
backend/src/agents/   # Agent nodes (triage, search, booking, guardrails)
```

Each agent node gets its own file. Guardrail checks are LangGraph nodes that run on every turn before other processing.

## Guardrails

- The agent **never asks for or stores PII** (names, addresses, IDs, payment info).
- If a user volunteers personal or payment information, the agent warns them and discards the data.
- All search responses are parsed into structured JSON before rendering.

## Roadmap

- **Phase 1** (current): Chat-based hospital/clinic finder.
- **Phase 2**: Voice agent support (architecture is designed to be extensible for voice I/O).

## License

See [LICENSE](LICENSE) for details.

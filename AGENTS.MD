# AGENTS.md

## Mission
Build the product correctly, efficiently, and with strong engineering discipline.

## Source of Truth
Before major work, check these files if they exist:
1. `PRD.md` — product requirements
2. `TDD.md` — technical design
3. `TASK.md` — current task
4. `MEMORY.md` — durable project decisions
5. 

If files conflict:
- `TASK.md` overrides current execution details
- `PRD.md` controls product direction
- `TDD.md` controls technical direction

## Working Rules
- Be direct, concise, and practical
- Do not make unnecessary changes
- Keep changes scoped to the task
- Prefer clarity over cleverness
- Do not invent requirements
- Ask when a decision is ambiguous and high-impact

## Code Rules
- Keep files small and readable
- Reuse existing patterns before creating new ones
- Avoid unnecessary abstraction
- Do not leave dead code behind
- Keep naming clear and consistent

## Safety
- Never expose secrets
- Never commit credentials
- Never perform destructive actions without clear intent
- Do not modify unrelated files

## Quality Bar
Before finishing:
- code should run
- logic should be understandable
- user-facing behavior should match the task
- major edge cases should be considered

## Delivery
When reporting work:
- say what changed
- say what remains
- say any blockers clearly


## Agents architecture design
All agents should not consider tokens optimisation and deliver best quality of result. The Supervisor will  be the main output.
- Supervisor agent
- Analyse agent
- Lookup agent
- RAG Agentic agent


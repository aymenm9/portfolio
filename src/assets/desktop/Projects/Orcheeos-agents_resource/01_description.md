# Orcheeos-agents

A behavioral study of LLM multi-agent systems across independent architectural variants. The same task set runs on all variants to produce a controlled comparison matrix measuring how increasing architectural freedom affects coordination quality, reasoning, failure modes, and emergent behavior.

## Tech Stack
- **Python 3.12+**, **FastAPI**, **LangGraph**, **LangChain**, **LangSmith**
- **Pydantic v2** (config via `pydantic-settings`)
- LLM providers: OpenAI, Google Gemini, OpenRouter, OpenCodeGo
- Dashboard: React 19, TypeScript, Vite

## Architectural Variants
- **Baseline 1** — Monolithic single agent (no orchestrator)
- **Baseline 2** — Single self-reflective agent (plans, executes, tests, fixes)
- **Level 1** — Predefined Architecture (5 specialty graphs, fixed workers)
- **Level 1B** — Manager Orchestrator (LLM-driven, no planner)
- **Level 2** — Template-Based Agent Creation (18 worker templates)
- **Level 3** — Fully Autonomous (agents generated from scratch)
- **Level X** — Hybrid Orchestrator (monolithic reliability + dynamic creation)

All variants use LangGraph `StateGraph` with star topology. LangSmith traces every decision path.

## Specialties
`frontend` · `backend` · `fullstack` · `brand` · `research`

## Results
36 runs across variants and specialties, scored on coordination quality, reasoning, cost, and emergent behavior. See the evaluation matrix and final report for full numbers.
# 🧠 OMNI-BRAIN — The Digital Sovereign

An autonomous, self-evolving AI that knows you better than any tool. 
Builds a complete behavioral twin that manages your digital life 24/7.

## Architecture

```
┌─────────────────────────────────────────────┐
│              OMNI-BRAIN CORE                │
├─────────────────────────────────────────────┤
│  Memory Core   │ Mirror Engine │ Task Router│
│  (LTM Engine)  │ (Voice Clone) │ (Multi-App)│
├─────────────────────────────────────────────┤
│           Agent Runner (24/7 Swarm)         │
│  Scout → Architect → Optimizer → Librarian  │
│              → Orchestrator → Envoy         │
├─────────────────────────────────────────────┤
│  GitHub Actions │ Supabase │ Discord │ n8n  │
│  Albato │ Svix  │ Hyperbrowser │ Composio   │
└─────────────────────────────────────────────┘
```

## Stack

| Layer | Tech | Status |
|-------|------|--------|
| Backend | Supabase (Postgres) | ✅ Live — `zmmiolzdowznlbgqbhnu` |
| Brain | TypeScript (Memory Core, Mirror Engine, Task Router) | ✅ Deployed |
| Automation | GitHub Actions (free/unlimited) | ✅ Running every 10min |
| Browser | Hyperbrowser (persistent profiles) | ✅ Sovereign Profile active |
| Comms | Discord (omni-brain server) | ✅ 13 channels |
| Webhooks | Albato + Svix | ✅ Active |
| AI | Composio (64 connections, 37+ toolkits) | ✅ Connected |

## Quick Start

```bash
# Trigger a task dispatch
curl -X POST https://api.github.com/repos/king5553250/agentic-hub/dispatches \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -d '{"event_type":"omni-brain-task","client_payload":{"app":"gmail","action":"fetch"}}'

# Fire dead switch (full state dump)
curl -X POST https://api.github.com/repos/king5553250/agentic-hub/dispatches \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -d '{"event_type":"dead-switch"}'
```

## Project Structure

```
src/brain/
├── memory-core.ts      # LTM engine — 10s persistence loop
├── mirror-engine.ts    # Behavioral twin — voice cloning
├── task-router.ts      # Multi-app orchestrator (10+ apps)
├── agent-runner.ts     # 24/7 swarm (6 agents)
└── index.ts            # Clean exports

.github/workflows/
├── swarm-engine.yml    # Every 10 min — Scout→Envoy cycle
├── task-dispatcher.yml # On-demand app commands
└── dead-switch.yml     # Full state dump

supabase/
├── migrations/001_brain_schema.sql  # 7 tables
└── seed.sql                         # Initial data
```

## Built by Mega-Agent Boss + Composio | 2026-09-22

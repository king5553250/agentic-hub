# 🤖 AI Agentic Hub

An AI-driven agentic automation hub — compose, deploy, and orchestrate intelligent agents across your favorite tools.

## 🏗 Architecture

```
🌐 Webhook Gateway (Svix)
       │
       ▼
🧠 Orchestrator (n8n)
       │
       ├──→ 🔀 Router → Albato Bridge → ActivePieces
       ├──→ 📧 Gmail Agent
       ├──→ 🐙 GitHub Agent  
       ├──→ ▶️ YouTube Agent
       └──→ 🔗 Custom Webhooks
```

## 🔌 Connected Services

| Service | Status | Endpoint |
|---------|--------|----------|
| n8n Workflow Engine | ✅ Active | Webhook: `/agentic-hub` |
| ActivePieces | ✅ Active | Flow: AI Agentic Hub - Webhook Ingest |
| Albato | ✅ Active | Relay Bridge |
| Svix | 🔗 Pending | Webhook Gateway |
| Gmail | ✅ Active | mahdilouz02@gmail.com |
| GitHub | ✅ Active | @king5553250 |
| YouTube | ✅ Active | Connected |
| Webhook.site | ✅ Active | Test Endpoint |

## 🚀 Quick Start

Send a POST request to the n8n webhook:

```bash
curl -X POST https://[n8n-instance]/webhook/agentic-hub \
  -H "Content-Type: application/json" \
  -d '{"action": "github_list_repos", "params": {}}'
```

## 📁 Agent Templates

- `agents/github-agent.yaml` - GitHub automation agent
- `agents/email-agent.yaml` - Gmail agent
- `agents/youtube-agent.yaml` - YouTube content agent
- `agents/webhook-relay.yaml` - Cross-platform webhook relay

## 🛠 Built With

- **n8n** - Workflow orchestration
- **ActivePieces** - Flow automation
- **Albato** - Integration bridge
- **Svix** - Webhook management
- **Composio** - AI agent framework
- **GitHub** - Agent store & version control

---
*Built by Mega-Agent Boss | 2026-09-19*
# agents/ — OpenClaw Agent Definitions & Skills

## Konteks untuk AI Collaborator

Folder ini berisi definisi agent dan skill yang berjalan di atas OpenClaw orchestration framework.

## Apa itu OpenClaw?
OpenClaw adalah open-source framework untuk membuat autonomous AI agent. Agent menerima request dari berbagai channel, melakukan reasoning, memilih tools, dan mengeksekusi aksi. OpenClaw mendukung multi-agent orchestration via shared SQLite queue dan Markdown interchange files.

## Struktur

```
agents/
├── definitions/
│   ├── analyst.json       — Agent spesialis analisis data/market
│   ├── coder.json         — Agent spesialis code review/generation
│   └── coordinator.json   — Meta-agent yang mengorkestrasikan agent lain
├── skills/
│   ├── sentiment/         — Skill: analisis sentimen (contoh skill module)
│   ├── risk-scoring/      — Skill: risk assessment
│   └── code-review/       — Skill: automated code review
└── orchestrator.ts        — OpenClaw orchestration logic
```

## Cara Kerja di Nexus

1. Agent didefinisikan sebagai JSON config (capabilities, model, system prompt)
2. Config dienkripsi dan disimpan di 0G Storage → di-mint sebagai INFT
3. Saat agent dijalankan, config di-decrypt → dikirim ke 0G Compute untuk inference
4. Skills adalah modul terpisah yang bisa di-"equip" ke agent via authorizeUsage
5. Multi-agent collaboration diorkestrasikan via OpenClaw

## Skill Module Format
Setiap skill adalah folder berisi:
- `manifest.json` — Nama, deskripsi, input/output schema, pricing
- `prompt.md` — System prompt untuk skill
- `handler.ts` — Execution handler (calls 0G Compute)

## Integrasi dengan Smart Contracts
- Agent definition → NexusAgentINFT.mintAgent()
- Skill definition → SkillRegistry.createSkill()
- Skill usage → SkillRegistry.payForUse() atau .subscribe()
- Agent equip skill → NexusAgentINFT.equipSkill()

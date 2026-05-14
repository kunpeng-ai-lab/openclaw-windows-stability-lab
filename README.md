# OpenClaw Windows Stability Lab

Maintained by **鲲鹏 AI 探索局 / kunpeng-ai-lab**.

Official site: [kunpeng-ai.com](https://kunpeng-ai.com)

GitHub organization: [kunpeng-ai-lab](https://github.com/kunpeng-ai-lab)

Repository: [openclaw-windows-stability-lab](https://github.com/kunpeng-ai-lab/openclaw-windows-stability-lab)

## What This Project Is

OpenClaw Windows Stability Lab is a practical reliability lab for running,
diagnosing, and improving OpenClaw on native Windows environments.

The goal is not to fork OpenClaw. The goal is to:

- collect reproducible Windows reliability cases
- build non-destructive diagnostic harnesses
- maintain version and issue evidence
- contribute small, testable fixes upstream
- turn real Windows agent failures into reusable engineering knowledge

This project is also used as a reliability asset source for internal GEO Agent
work at kunpeng-ai-lab.

## Why It Exists

OpenClaw moves fast. New versions bring valuable features, but Windows users can
hit issues around:

- gateway process and port state
- Scheduled Task and background startup behavior
- Feishu or other channel messages received but no agent response
- stale or duplicate `node.exe` process trees
- Node version differences
- Windows file locking
- plugin/runtime startup behavior
- proxy and environment isolation

This lab turns those issues into evidence, harness checks, cases, and upstream
contributions.

## Current Phase 2 Results

Phase 2 is closed.

Highlights:

- Built `agent-windows-reliability`, a JSON-first Windows reliability harness.
- Added registered smoke targets:
  - `gateway`
  - `gateway-lifecycle` (target contract scaffolding only)
  - `agent-responsiveness`
  - `process-tree`
- Exported shared TypeScript types and JSON Schemas for downstream agents.
- Added 3 reusable stability cases in `cases/`.
- Submitted and merged an upstream OpenClaw fix:
  - PR: [openclaw/openclaw#76024](https://github.com/openclaw/openclaw/pull/76024)
  - Issue: [openclaw/openclaw#64187](https://github.com/openclaw/openclaw/issues/64187)

## Directory Layout

```text
openclaw-windows-stability-lab/
  cases/       Reusable Windows stability cases
  docs/        Planning, review, and decision documents
  evidence/    Screenshots and evidence archives
  guardian/    Guardian Agent - AI diagnostics (Phase 3)
  projects/    Guardian Agent implementation (clawhub-plugin style)
  harness/     agent-windows-reliability package
  mindmaps/    Asset and diagnostic relationship maps
  reports/     Phase handoff and closure reports
  scripts/     Utility scripts
  skills/      Skill and workflow notes
  upstream/    Upstream contribution ledger and PR planning
  wiki/        Human-readable knowledge base
```

## Harness: agent-windows-reliability

The main executable asset is:

```text
harness/agent-windows-reliability
```

Install dependencies:

```powershell
cd harness/agent-windows-reliability
npm install
```

Run tests:

```powershell
npm test
```

Build:

```powershell
npm run build
```

Run doctor:

```powershell
npm run dev -- doctor --profile openclaw --json
```

Run smoke checks:

```powershell
npm run dev -- smoke gateway --profile openclaw --json
npm run dev -- smoke agent-responsiveness --profile openclaw --json
npm run dev -- smoke process-tree --profile openclaw --json
```

The harness is designed to be:

- non-destructive by default
- JSON-parseable for agents
- useful for human diagnostics
- conservative about local path and sensitive data exposure

## Smoke Targets

| Target | Purpose | Destructive |
| --- | --- | --- |
| `gateway` | Basic gateway process, port, scheduled task, and connectivity checks. | No |
| `gateway-lifecycle` | Target contract scaffolding for future lifecycle checks. It is not a real lifecycle validator yet. | No |
| `agent-responsiveness` | Diagnoses "message received but agent does not reply" style failures. | No |
| `process-tree` | Checks missing, duplicate, or stale OpenClaw-related process signals. | No |

## Case Library

The case library is under:

```text
cases/
```

Current cases:

- `openclaw-win-2026-05-02-memory-ebusy-atomic-reindex`
- `openclaw-win-2026-05-03-agent-responsiveness-no-reply`
- `openclaw-win-2026-05-03-process-tree-stale-gateway`

Machine-readable index:

```text
cases/index.json
```

## Upstream Contribution Model

The lab follows a small-PR upstream model:

1. reproduce or collect strong evidence
2. keep patch scope narrow
3. avoid core architecture rewrites unless explicitly planned
4. include tests
5. preserve evidence and screenshots
6. document maintainer feedback

Contribution ledger:

```text
upstream/CONTRIBUTION_LEDGER.zh-CN.md
```

Known merged upstream contribution:

- [OpenClaw PR #76024: fix(memory): retry transient index swaps on Windows](https://github.com/openclaw/openclaw/pull/76024)

## Relationship To Agent Collaboration SOP

This project uses ACS / Agent Collaboration SOP for two-agent engineering
collaboration:

- ACS repository: [agent-collaboration-sop](https://github.com/kunpeng-ai-lab/agent-collaboration-sop)

Key rules:

- executor does not self-approve
- reviewer checks design, architecture, tests, evidence, and scope drift
- important verification must have ledger evidence
- upstream PRs require Owner approval

## External Links

- Main site: [kunpeng-ai.com](https://kunpeng-ai.com)
- GitHub org: [kunpeng-ai-lab](https://github.com/kunpeng-ai-lab)
- ACS project: [agent-collaboration-sop](https://github.com/kunpeng-ai-lab/agent-collaboration-sop)
- OpenClaw upstream: [openclaw/openclaw](https://github.com/openclaw/openclaw)
- Merged upstream PR: [openclaw/openclaw#76024](https://github.com/openclaw/openclaw/pull/76024)

## Open Source Boundary

This repository contains reliability harnesses, public evidence, and engineering
process assets. It does not contain private GEO Agent product source code,
customer secrets, production credentials, or paid-service internals.

If you find sensitive data in this repository, please open a private security
report or contact the maintainers through the official site.

## License

MIT License. See [LICENSE](LICENSE).


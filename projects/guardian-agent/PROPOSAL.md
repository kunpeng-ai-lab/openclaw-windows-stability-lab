# Guardian Agent — RFC Tracking & Status

> Maintained by: 鲲鹏 AI 探索局 / kunpeng-ai-lab  
> Official site: [kunpeng-ai.com](https://kunpeng-ai.com)

## RFC Issue
[openclaw/openclaw #81648](https://github.com/openclaw/openclaw/issues/81648)

## Phase 3 Initiation (2026-05-14)
- **Objective**: Develop an AI-driven diagnostic agent that triggers on `--doctor` or crash states.
- **Scope**: Windows ecosystem reliability (proxy, stale processes, file locks, gateway health).
- **Status**: **Proposal submitted and approved as Community Plugin (ClawHub style).**

## Architecture Draft

```text
User / System
      │
      ▼ (Trigger: openclaw --doctor or crash hook)
Guardian Agent Launcher (ClawHub Plugin)
      │
      ├── Phase 1: Silent Scan (Harness Integration)
      │     ├── Process Tree Check
      │     ├── Gateway Health / Port
      │     └── Agent Responsiveness
      │
      ├── Phase 2: Auto-Heal (Safe Scope)
      │     ├── Stale Process Cleanup
      │     └── Lock File Release (EBUSY)
      │
      └── Phase 3: Dialogue Loop (On Failure)
            ├── Request Logs / User Input
            └── Guided Step-by-Step Repair
```

## Milestones
- [x] **Spike 1**: Prototype harness wrapper integration (local only). (Skeleton Complete)
- [ ] **Spike 2**: Auto-heal action verification against known cases.
- [ ] **Spike 3**: Conversational CLI interface skeleton.

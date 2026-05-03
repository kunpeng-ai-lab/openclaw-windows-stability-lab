# Case: Stale or duplicate OpenClaw gateway process tree

Case ID: `openclaw-win-2026-05-03-process-tree-stale-gateway`

Status: `harness-diagnostic-ready`

Primary related issues:

- https://github.com/openclaw/openclaw/issues/64253

## Summary

On Windows, OpenClaw can look "running" while the useful gateway or agent path is
degraded. Process-tree diagnostics help distinguish missing, duplicate, stale,
or suspicious OpenClaw-related `node.exe` processes without dumping full local
command lines.

## Symptoms

- scheduled task or wrapper says gateway is running
- port or channel behavior does not match expected runtime state
- gateway process exists but may be old or degraded
- duplicate related processes may remain after restart or update

## Root Cause Class

- `process`
- `gateway`
- `scheduled-task`
- `stale-runtime`
- `windows-service`

## Harness Mapping

Current harness target:

```powershell
agent-win smoke process-tree --profile openclaw --json
```

Checks currently include:

- OpenClaw Gateway Process Cardinality
- OpenClaw Related Process Inventory
- OpenClaw Stale Process Risk

The target uses Windows process inventory and avoids exposing raw full command
lines or local paths in output.

## Decision Rule

If OpenClaw status and observed behavior disagree:

1. run `process-tree`
2. run `gateway`
3. compare process cardinality, port ownership, and stale process risk
4. if duplicate or stale process risk is present, collect evidence before
   restarting
5. do not assume scheduled task state equals gateway availability

## GA Mapping

Reusable GA capabilities:

- runtime process evidence collection
- task worker liveness diagnostics
- stale job / stale process risk classification
- customer-safe report artifact generation

For GEO operations, this maps to long-running publishing, crawling, validation,
and report-generation jobs where process existence alone is not enough.

## Evidence

Local handoff:

- `reports/OWSL_PHASE2_PROCESS_TREE_HANDOFF_2026-05-03.md`

Verification:

- `agent-windows-reliability` contract tests passed after adding the registered
  `process-tree` target.
- Manual CLI produced parseable JSON. A stale-age warning can be expected when
  the gateway process is older than the target threshold.

## Upstream Status

No upstream PR yet. This is a diagnostic harness case. Future upstream work may
be appropriate if a small process-lifecycle bug is locally reproduced with a
narrow testable patch.


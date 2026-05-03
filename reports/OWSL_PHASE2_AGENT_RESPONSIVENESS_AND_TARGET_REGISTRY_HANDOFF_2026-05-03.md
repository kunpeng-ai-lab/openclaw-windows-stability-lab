# OWSL Phase 2 Handoff: Agent Responsiveness + Target Registry

Date: 2026-05-03
Prepared by: Codex
Reviewer: Claude Code
Status: Ready for CC review

## Scope

This implements the first P1 Windows stability check and the Owner-requested
target-driven routing mechanism.

Delivered:

- `smokeCommand` no longer owns a growing target `switch`.
- Smoke targets are registered through `src/targets/smoke-targets.ts`.
- `agent-responsiveness` is added as the first P1 target using the registry.
- CLI and library contracts cover the new target.

Non-goals:

- No real Feishu message send.
- No OpenClaw config mutation.
- No gateway restart/kill/start behavior.
- No OpenClaw upstream PR.
- No npm publish.

## Changed Files

```text
harness/agent-windows-reliability/README.md
harness/agent-windows-reliability/src/checks/agent-responsiveness.ts
harness/agent-windows-reliability/src/commands/smoke.ts
harness/agent-windows-reliability/src/targets/smoke-targets.ts
harness/agent-windows-reliability/tests/contract.test.ts
harness/agent-windows-reliability/dist/**
```

## Architecture Change

Before:

```text
smokeCommand
-> switch target
-> inline section/check selection
```

After:

```text
smokeCommand
-> getSmokeTarget(target)
-> SmokeTargetDefinition
-> runChecks(profile)
```

Target definitions now live in:

```text
src/targets/smoke-targets.ts
```

Each target declares:

```text
target
sectionName
runChecks(profile)
```

This prevents future checks from expanding command-level control flow.

## Agent Responsiveness Checks

`agent-responsiveness` currently runs three non-destructive checks:

1. `Responsiveness Gateway Process`
   - Reuses the existing gateway process check.
   - Confirms the gateway process exists and is not duplicated.

2. `Responsiveness Gateway Port`
   - Reuses the existing port responding check.
   - Confirms port 18789 accepts local TCP connections.

3. `Recent Responsiveness Log Signals`
   - Scans recent OpenClaw log tails under known local log roots.
   - Detects risk patterns associated with "message received but agent does not reply":
     - Feishu channel exited.
     - Feishu channel auto-restart attempts.
     - Windows ESM `c:` path protocol errors.
     - API timeout signals.
     - unhandled promise rejection.
   - Does not expose scanned local file paths in check details.

## Verification

Commands run in:

```text
D:\workspace\openclaw-windows-stability-lab\harness\agent-windows-reliability
```

### Contract Tests

```powershell
npm test
```

Result:

```text
tests 9
pass 9
fail 0
```

### Build

```powershell
npm run build
```

Result:

```text
exit code 0
```

### Manual CLI Smoke

```powershell
node --import tsx src/cli.ts smoke agent-responsiveness --profile openclaw --json
```

Result on this machine:

```text
command: smoke
target: agent-responsiveness
ok: true
exitCode: 0
summary: 3 pass, 0 fail, 0 warn, 0 skip
```

## Review Request For CC

Please review:

1. Whether `src/targets/smoke-targets.ts` satisfies the Owner requirement for
   target-driven check routing.
2. Whether `agent-responsiveness` is correctly scoped as a non-destructive P1
   stability check.
3. Whether the recent log signal patterns are useful and not overclaiming.
4. Whether local path leakage is sufficiently avoided in check details.
5. Whether this satisfies part of Phase 2 exit criterion #2:
   at least 2 new Windows stability checks with source, tests, and CC review.

## Suggested Next Step

If approved, continue with the second P1/P2 stability check. Suggested next
candidate:

```text
process-tree
```

Reason: it complements `agent-responsiveness` by showing whether gateway and
child runtime processes are duplicated, orphaned, or stale.

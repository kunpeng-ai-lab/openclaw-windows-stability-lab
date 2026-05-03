# Case: Channel receives message but agent does not reply

Case ID: `openclaw-win-2026-05-03-agent-responsiveness-no-reply`

Status: `harness-diagnostic-ready`

Primary related issues:

- https://github.com/openclaw/openclaw/issues/63257
- https://github.com/openclaw/openclaw/issues/64253

## Summary

On Windows, a channel such as Feishu may receive inbound messages while the
agent does not produce a usable reply. This should not be treated as a single
"Feishu secret is wrong" problem. It can involve channel startup, provider
timeouts, agent dispatch, runtime blocking, or gateway degradation.

## Environment Signals

Known related public issue signals:

- Feishu API startup timeout after 30 seconds on Windows with Node v24.14.1.
- Gateway becomes progressively unresponsive under subagent load while the
  gateway process remains alive.
- Completion announcements and provider failover can time out.

## Symptoms

- channel receives message
- logs show dispatch or channel activity
- user receives no reply or delayed reply
- gateway process remains alive
- gateway responsiveness may degrade without crashing

## Root Cause Class

- `channel`
- `agent-dispatch`
- `provider-timeout`
- `gateway-degraded`
- `windows-runtime`

## Harness Mapping

Current harness target:

```powershell
agent-win smoke agent-responsiveness --profile openclaw --json
```

Checks currently include:

- gateway process presence
- gateway port/listener signal
- recent responsiveness log signals

The check is non-destructive and does not emit raw local log paths.

## Decision Rule

If a user reports "Feishu received the message but OpenClaw did not reply":

1. run `agent-responsiveness`
2. inspect gateway process and port state
3. inspect recent log signals for channel exits, auto-restarts, API timeouts,
   Windows ESM path errors, and unhandled promise rejections
4. only after those checks pass, investigate Feishu credentials or app config
5. avoid reinstalling OpenClaw or rotating secrets without evidence

## GA Mapping

Reusable GA capabilities:

- daily operations agent health check
- task responsiveness diagnostics
- external platform delivery diagnosis
- evidence chain for "message accepted but task not completed"

For GEO operations, this maps to external publishing, forum posting, report
sending, and search validation tasks where "platform accepted input" is not the
same as "agent finished the job".

## Evidence

Local handoff:

- `reports/OWSL_PHASE2_AGENT_RESPONSIVENESS_AND_TARGET_REGISTRY_HANDOFF_2026-05-03.md`

Verification:

- `agent-windows-reliability` contract tests passed after adding the registered
  `agent-responsiveness` target.

## Upstream Status

No upstream PR yet. This case is currently a diagnostic harness case and should
not become an upstream PR until a local reproduction and narrow patch candidate
are identified.


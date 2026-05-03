# OWSL Phase 2: Next Upstream PR Selection

Date: 2026-05-03
Status: Candidate selection, not approved for PR submission

## Current Phase 2 Upstream Status

Phase 2 exit criterion #3 is satisfied by OpenClaw PR #76024:

- PR: https://github.com/openclaw/openclaw/pull/76024
- Issue: https://github.com/openclaw/openclaw/issues/64187
- Status: merged
- Merged by: `steipete`
- Merged date shown publicly: May 2, 2026

This means the next upstream PR is optional for Phase 2 closure, but useful for
continuing the OWSL flywheel.

## Hard Constraints

Any next upstream PR must satisfy all four constraints:

1. local reproduction evidence exists
2. patch size target: no more than `+200/-50`
3. no core architecture changes
4. includes tests

If a candidate fails any item, keep it as harness/research, not a PR.

## Candidate Review

### Candidate A: #71717 exec EPERM on Windows

Issue: https://github.com/openclaw/openclaw/issues/71717

Public facts checked:

- issue is open
- Windows 11
- OpenClaw version reported: 2026.4.23
- install method: npm global
- symptom: all exec tool commands fail with `spawn EPERM`
- no linked branch or PR shown on the public issue page

Pros:

- high user impact
- likely small if root cause is command spawn/env/path/permission handling
- maps well to GA runtime execution reliability

Risks:

- current issue evidence is thin
- local reproduction is not yet established
- could expand into Windows permission policy or sandbox architecture

Recommendation:

- run a 1-2 hour investigation spike
- only proceed to PR if a narrow spawn/exec guard or testable Windows shim issue
  is found

### Candidate B: #62099 auth-profiles.json EPERM cascade

Issue: https://github.com/openclaw/openclaw/issues/62099

Public facts checked:

- issue is open
- related PR link is visible as #67077
- OpenClaw version reported: 2026.4.5
- Windows 11, Node v24.14.1
- symptom: `auth-profiles.json` ReadOnly attribute or write failure causes
  request/fallback cascade

Pros:

- strong evidence in issue body
- high user impact
- maps directly to GA credential/config write safety

Risks:

- visible related PR means duplicate work risk
- auth/profile persistence may be sensitive
- could touch broader provider fallback behavior

Recommendation:

- do not start PR until #67077 status and patch scope are reviewed
- use as case/research unless a small uncovered test gap is identified

### Candidate C: #63257 Feishu API timeout at startup

Issue: https://github.com/openclaw/openclaw/issues/63257

Public facts checked:

- issue is open
- Windows 11, Node v24.14.1, OpenClaw 2026.4.8
- Feishu API request times out after 30 seconds in gateway startup
- PowerShell request succeeds quickly while Node axios path times out
- no linked branch or PR shown publicly

Pros:

- closely matches user-facing OWSL/GA channel reliability
- maps to `agent-responsiveness` harness target

Risks:

- likely network/proxy/SDK/environment specific
- local Feishu app credentials may be needed to reproduce
- may not yield a small upstream patch

Recommendation:

- keep as harness/case candidate first
- avoid upstream PR until local reproduction and narrow code boundary exist

### Candidate D: #64253 gateway unresponsive under subagent load

Issue: https://github.com/openclaw/openclaw/issues/64253

Public facts checked:

- issue is open
- Windows 10, Node v25.5.0, OpenClaw 2026.4.5
- gateway remains alive but becomes unresponsive under subagent completion load
- no linked branch or PR shown publicly

Pros:

- highest harness value
- maps to GA long-running task watchdog and process health

Risks:

- likely not a small PR
- may touch gateway/session/provider scheduling
- violates "no core architecture" unless a very narrow bug is found

Recommendation:

- keep as harness and architecture research
- not recommended as next upstream PR

## Recommendation

Next action:

1. choose #71717 as the first investigation spike candidate
2. keep #62099 as backup after checking related PR #67077
3. keep #63257 and #64253 as harness/case work, not immediate PRs

Do not submit a PR until CC reviews the spike result and Owner approves.


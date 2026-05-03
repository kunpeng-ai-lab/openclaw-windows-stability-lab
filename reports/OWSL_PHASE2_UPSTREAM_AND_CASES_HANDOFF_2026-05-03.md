# OWSL Phase 2 Handoff: Upstream PR Selection + Stability Cases

Date: 2026-05-03
Prepared by: Codex
Reviewer: CC

## Scope

This handoff covers remaining Phase 2 items after schema export and GA evidence
adapter review:

- Criterion #3: upstream PR merged or under review
- Criterion #6 support: reusable stability cases for GA/OWSL asset loop

## Current Status

Criterion #3 is effectively complete:

- OpenClaw PR #76024 is merged.
- Public PR page shows merged state and `steipete` as the merging maintainer.
- Local evidence already exists under `evidence/openclaw-pr-76024`.

New documents created:

- `upstream/next-pr-selection-2026-05-03.md`
- `cases/README.md`
- `cases/index.json`
- `cases/openclaw-win-2026-05-02-memory-ebusy-atomic-reindex.md`
- `cases/openclaw-win-2026-05-03-agent-responsiveness-no-reply.md`
- `cases/openclaw-win-2026-05-03-process-tree-stale-gateway.md`

## Case Library Added

Three Phase 2 cases were added:

1. `openclaw-win-2026-05-02-memory-ebusy-atomic-reindex`
   - source: merged PR #76024 / issue #64187
   - status: upstream-merged
   - GA mapping: file-lock classification, version matrix, evidence ingestion

2. `openclaw-win-2026-05-03-agent-responsiveness-no-reply`
   - source: Phase 2 `agent-responsiveness` harness work
   - related issues: #63257, #64253
   - status: harness-diagnostic-ready
   - GA mapping: external-platform delivery diagnostics and daily health checks

3. `openclaw-win-2026-05-03-process-tree-stale-gateway`
   - source: Phase 2 `process-tree` harness work
   - related issue: #64253
   - status: harness-diagnostic-ready
   - GA mapping: runtime process evidence and stale job risk classification

## Next PR Selection

Recommended next upstream PR action:

- choose #71717 as an investigation spike candidate
- do not submit a PR yet
- only proceed if local reproduction exists and the patch stays within the four
  Owner-approved constraints

Backup:

- #62099, but only after checking related PR #67077 to avoid duplicate work

Harness-only / research:

- #63257
- #64253

## Verification

Documentation-only change. No harness source code changed in this step.

Validation performed:

- case index is valid JSON by inspection and should be machine-readable
- public GitHub pages were checked for issue/PR status and visible metadata

## Review Request For CC

Please review:

1. whether these 3 case records satisfy Phase 2 case-library requirement
2. whether criterion #3 can be marked complete based on merged PR #76024
3. whether #71717 is acceptable as the next investigation-only upstream candidate
4. whether any case needs extra fields before Phase 2 closure

If approved, please report the Phase 2 progress update to Owner and confirm
whether Codex should begin the #71717 investigation spike.

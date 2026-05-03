# CC Review: OWSL Phase 2 Plan

Date: 2026-05-02

Status: Closed

Closed at: 2026-05-03

Closure note: Owner confirmed all 7 Phase 2 exit criteria passed. OWSL execution is paused after closure.

Reviewer: CC (Claude Code)

Reviewee: Codex (OWSL executor)

Subject: Phase 2 three-track plan (Harness expansion, Upstream contribution, GA mapping)

---

## 1. Overall Verdict

Phase 2 plan direction aligns with OWSL goals (framework.md dual-flywheel model). Direction APPROVED.

5 adjustments required before reporting to Owner.

---

## 2. Review Items

### 2.1 gateway-lifecycle as Phase 2 first harness closure point: RESERVED

Current state: `gateway-lifecycle` and `gateway` execute identical `runGatewayChecks()`. It is a placeholder target, not a real lifecycle check.

Verdict: Acceptable as closure of target contract and routing framework. NOT acceptable as closure of lifecycle check capability.

Required action: Closure document title must read "gateway-lifecycle target contract scaffolding". Real lifecycle checks (start/stop/restart/reconnect) belong to Phase 2 Harness expansion track milestones.

### 2.2 Missing Windows stability checks

Codex proposed: process-tree, scheduled-task, port-listener, node-runtime.

CC additions based on framework.md problem inventory:

| Priority | Check | Source |
|----------|-------|--------|
| P0 | gateway-lifecycle (contract scaffolding) | Already exists, needs closure |
| P1 | process-tree | Codex proposed |
| P1 | agent-responsiveness | CC addition - "Feishu receives message but agent does not reply", "agent dispatch stuck" |
| P2 | scheduled-task | Codex proposed |
| P2 | port-listener | Codex proposed |
| P2 | node-runtime | Codex proposed |
| P2 | plugin-runtime-health | CC addition - "plugin runtime deps reinstall repeatedly" |
| P2 | proxy-env-isolation | CC addition - "proxy env vars written to gateway service" |

### 2.3 Upstream issue/PR selection criteria: needs tightening

Codex criteria: Windows reproducible, small change, testable, no large architecture touch.

CC additions (4 constraints):

1. Must have local reproduction evidence - cannot rely solely on issue description.
2. PR size cap: +200/-50 lines - #64187 was +137/-11, next PR should match or smaller.
3. No core architecture paths - gateway routing, session management, provider scheduling are out of scope.
4. Must include test coverage - pure doc/typo PRs do not count toward OWSL contribution value.

### 2.4 GA mapping track: needs concrete deliverables

"Make OWSL become GA reliability backend" is too vague for Phase 2.

Required Phase 2 GA mapping deliverables:

| Deliverable | Description |
|-------------|-------------|
| Harness schema export | `agent-windows-reliability` exports TypeScript types and JSON Schema |
| GA evidence adapter | GA OpenClawAdapter can call OWSL harness and include results in evidence chain |
| At least 3 stability cases | Reusable diagnostic cases from #64187 + Phase 2 fixes |

### 2.5 Phase 2 Exit Criteria

| # | Exit Criterion | Verification |
|---|---------------|-------------|
| 1 | gateway-lifecycle target contract closure | Closure doc + CC review pass |
| 2 | At least 2 new Windows stability checks (P0/P1) | Source + tests + CC review pass |
| 3 | At least 1 new upstream PR merged or under review | Contribution Ledger updated |
| 4 | Harness schema exported as TypeScript types | src/schemas.ts exports + GA can import |
| 5 | GA can call OWSL harness and include in evidence chain | GA e2e test coverage |
| 6 | All changes reviewed by CC | CC review record per deliverable |
| 7 | CC reports Phase 2 closure to Owner | Closure document |

---

## 3. Risk Additions

| Risk | Impact | Mitigation |
|------|--------|-----------|
| gateway-lifecycle misjudged as completed lifecycle check | Owner/external overestimates OWSL capability | Closure doc explicitly labels as contract scaffolding |
| Overbroad upstream PR selection causes maintainer pushback | Contribution path closed | Enforce 4 selection constraints strictly |
| GA mapping track becomes empty talk without concrete deliverables | OWSL decouples from GA | Phase 2 must deliver schema export + evidence adapter |
| Too many harness checks dilute effort | Phase 2 timeline bloats | P0/P1 first, P2 deferrable to Phase 3 |

---

## 4. Required Actions for Codex

1. Confirm gateway-lifecycle closure is "contract scaffolding" only.
2. Add agent-responsiveness, plugin-runtime-health, proxy-env-isolation to harness expansion plan.
3. Accept 4 upstream PR selection constraints.
4. Define concrete GA mapping deliverables (schema export + evidence adapter + 3 cases).
5. Accept 7 exit criteria listed above.

After all 5 items confirmed, Codex reports consensus to Owner. CC will not report until Codex confirms adjustments.

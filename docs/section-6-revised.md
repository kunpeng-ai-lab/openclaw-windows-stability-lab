# Section 6: Revised Evidence Supplement

Date: 2026-05-01 (Revised based on Codex feedback)

This document revises the Section 6 supplement based on Codex's feedback, addressing:
1. Split issue rankings into upstream-PR and harness priorities
2. Strengthen case schema with redaction/artifacts/reproduction
3. ASCII-first CLI output with --json/--output/--dry-run/--apply
4. Avoid duplicating existing PRs #73533 and #75343

---

## 6.1 OpenClaw Windows Issue Matrix (Revised)

### PR Status Summary

Based on investigation of current open PRs:

| Issue | Has Active PR? | PR Number | Status |
|-------|---------------|-----------|--------|
| #71717 | No | - | No PR found |
| #75352 | Yes | #75343 | Open, awaiting review |
| #64187 | No | - | No PR found |
| #56106 | Yes | #73751 | Open (carries forward #64661) |
| #60713 | Yes | #73533 | Open, awaiting review |
| #70788 | Yes | #48320 | Open |
| #64253 | No | - | No PR found |
| #62099 | No | - | No PR found |
| #63491 | Yes | #73889 | Open |
| #70451 | No | - | No PR found |
| #63257 | No | - | No PR found |
| #58139 | No | - | No PR found |
| #18985 | No | - | No PR found |
| #75 | No | - | No PR found |
| #72595 | No | - | No PR found |

### Ranking A: Upstream Small-PR Priority

For near-term contribution, prioritize issues that:
- Can be fixed with small, low-risk PRs
- Have clear reproduction steps
- Have good evidence quality
- Have high maintainer readiness

**Scoring Formula:**
```
UpstreamScore = Impact * 2 + Repro * 1.5 + Evidence * 1.5 + PRSize * 1 + MaintainerReadiness * 1
```

| Rank | Issue | Impact | Repro | Evidence | PRSize | Maintainer | Score | Has PR? |
|------|-------|--------|-------|----------|--------|------------|-------|---------|
| 1 | #64187 (sqlite EBUSY) | 4 | 4 | 3 | 4 | 3 | 23.5 | No |
| 2 | #71717 (exec EPERM) | 5 | 4 | 3 | 4 | 2 | 23.0 | No |
| 3 | #62099 (auth-profiles EPERM) | 4 | 4 | 3 | 4 | 3 | 23.0 | No |
| 4 | #70451 (hooks timeout) | 4 | 3 | 2 | 4 | 3 | 20.5 | No |
| 5 | #64253 (gateway unresponsive) | 5 | 3 | 2 | 2 | 2 | 19.5 | No |
| 6 | #63257 (Feishu timeout) | 3 | 3 | 2 | 4 | 3 | 19.0 | No |
| 7 | #58139 (Docker bind mount) | 3 | 3 | 3 | 4 | 2 | 18.5 | No |
| 8 | #72595 (proxy bypass) | 2 | 3 | 2 | 4 | 3 | 16.5 | No |
| 9 | #18985 (MSYS/Fishshell) | 2 | 3 | 2 | 3 | 2 | 14.5 | No |
| 10 | #75 (Clawdbot Apps) | 2 | 2 | 2 | 3 | 2 | 13.0 | No |

**Note:** Issues with existing PRs (#75352, #56106, #60713, #70788, #63491) are excluded from "next PR" consideration. Our role is to help review/validate those PRs, not duplicate them.

### Ranking B: Reliability Harness Priority

For our long-term harness and GEO Agent capability, prioritize issues that:
- Have high diagnostic reuse potential
- Affect core reliability (gateway, agent dispatch, channels)
- Can be captured by automated smoke tests
- Recur across versions

**Scoring Formula:**
```
HarnessScore = Impact * 2 + Repro * 1.5 + Evidence * 1.5 + HarnessConvert * 2 + DiagnosticReuse * 1.5
```

| Rank | Issue | Impact | Repro | Evidence | Harness | Reuse | Score | Category |
|------|-------|--------|-------|----------|---------|-------|-------|----------|
| 1 | #64253 (gateway unresponsive) | 5 | 3 | 2 | 4 | 5 | 27.0 | gateway/arch |
| 2 | #63491 (Scheduled Task restart) | 4 | 4 | 3 | 5 | 4 | 26.5 | daemon/service |
| 3 | #71717 (exec EPERM) | 5 | 4 | 3 | 5 | 3 | 26.0 | exec/process |
| 4 | #62099 (auth-profiles EPERM) | 4 | 4 | 3 | 4 | 4 | 24.5 | security/fs |
| 5 | #63257 (Feishu timeout) | 3 | 3 | 2 | 4 | 5 | 22.0 | channel/network |
| 6 | #70451 (hooks timeout) | 4 | 3 | 2 | 3 | 4 | 21.5 | hooks/process |
| 7 | #64187 (sqlite EBUSY) | 4 | 4 | 3 | 3 | 2 | 21.5 | sqlite/fs |
| 8 | #56106 (GBK encoding) | 4 | 5 | 4 | 3 | 2 | 21.5 | encoding |
| 9 | #75352 (LSP .cmd shim) | 5 | 5 | 5 | 4 | 2 | 25.5 | spawn/path |
| 10 | #60713 (C:\tmp path) | 3 | 5 | 5 | 5 | 2 | 23.5 | path/temp |

### Combined Priority View

**Issues WITHOUT active PR (our contribution opportunities):**

| Issue | Upstream Rank | Harness Rank | Recommended Action |
|-------|--------------|--------------|-------------------|
| #64187 | 1 | 7 | **Investigation-first candidate** |
| #71717 | 2 | 3 | Strong candidate, needs more investigation |
| #62099 | 3 | 4 | Good candidate, security-focused |
| #64253 | 5 | 1 | **Best harness candidate** (harder PR) |
| #70451 | 4 | 6 | Medium priority |
| #63257 | 6 | 5 | Channel-specific |
| #58139 | 7 | - | Docker-specific |
| #72595 | 8 | - | Network/proxy |
| #18985 | 9 | - | Feature request |
| #75 | 10 | - | Feature request |

**Issues WITH active PR (review/validation opportunities):**

| Issue | PR | Our Role |
|-------|-----|----------|
| #75352 | #75343 | Offer Windows LSP reproduction validation |
| #56106 | #73751 | Verify codepage-aware decoding on Chinese Windows |
| #60713 | #73533 | Verify temp dir fix, check changelog feedback |
| #70788 | #48320 | Verify windowsHide flag propagation |
| #63491 | #73889 | Verify Scheduled Task restart behavior |

---

## 6.2 Case Schema (Revised)

Based on Codex feedback, here is the updated TypeScript interface:

```typescript
// case.schema.ts

export interface WindowsStabilityCase {
  /** Unique case identifier, format: openclaw-win-YYYY-MM-DD-<slug> */
  id: string;

  /** Human-readable title */
  title: string;

  /** Case status */
  status: 'draft' | 'investigating' | 'root-cause-identified' | 'fix-proposed' | 'fix-verified' | 'upstream-submitted' | 'resolved';

  /** System environment */
  environment: {
    os: string;           // e.g., "Windows 10 Pro 22H2"
    node: string;         // e.g., "24.14.0"
    openclaw: string;     // e.g., "2026.4.29"
    installMethod: 'npm' | 'pnpm' | 'docker' | 'binary';
    shell?: string;       // e.g., "PowerShell 7.4", "Git Bash"
    locale?: string;      // e.g., "zh-CN", "en-US"
  };

  /** Affected version range (NEW) */
  affectedVersions?: {
    openclaw?: string;    // e.g., ">=2026.4.25"
    node?: string;        // e.g., ">=22"
    windows?: string;     // e.g., ">=10 22H2"
  };

  /** Affected surfaces (NEW) */
  affectedSurfaces: Array<
    | 'install'
    | 'upgrade'
    | 'gateway'
    | 'channel'
    | 'agent-dispatch'
    | 'plugin'
    | 'lsp'
    | 'memory'
    | 'filesystem'
    | 'proxy'
    | 'ui'
    | 'exec'
    | 'encoding'
  >;

  /** Observable symptoms */
  symptoms: Array<{
    id: string;           // e.g., "gateway_probe_timeout"
    description: string;
    observed: boolean;
    evidence?: string;    // log snippet or command output
  }>;

  /** Reproduction steps (NEW) */
  reproduction?: {
    steps: string[];
    expected: string;
    actual: string;
    reproducibility: 'always' | 'often' | 'intermittent' | 'unknown';
    lastReproducedAt?: string;
  };

  /** Evidence collection */
  evidence: {
    commands: Array<{
      command: string;
      shell?: string;     // e.g., "powershell", "cmd", "bash"
      cwd?: string;
      exitCode?: number;
      durationMs?: number;
      outputRef?: string; // path to artifact
      outputSnippet?: string; // small inline snippet only
      timestamp?: string;
    }>;
    logs: Array<{
      source: string;     // e.g., "gateway.log", "event viewer"
      contentRef?: string; // path to artifact
      contentSnippet?: string; // small inline snippet only
      timestamp?: string;
    }>;
    screenshots?: string[];
    processState?: Array<{
      pid: number;
      name: string;
      commandLine: string;
      parentPid?: number;
    }>;
  };

  /** Artifact references (NEW - replaces large inline logs) */
  artifacts?: Array<{
    type: 'log' | 'command-output' | 'screenshot' | 'trace' | 'config' | 'bundle';
    path: string;
    sha256?: string;
    redacted: boolean;
    notes?: string;
  }>;

  /** Redaction metadata (NEW) */
  redaction: {
    checked: boolean;
    method?: string;      // e.g., "auto-patterns", "manual-review"
    sensitiveFieldsRemoved: string[]; // e.g., ["api_keys", "tokens", "secrets"]
  };

  /** Diagnosis */
  diagnosis: {
    category: 'exec' | 'spawn' | 'path' | 'encoding' | 'filesystem' | 'gateway' | 'channel' | 'daemon' | 'security' | 'network' | 'ux';
    rootCause: string;
    confidence: 'low' | 'medium' | 'high';
    relatedIssues?: string[];  // GitHub issue numbers
  };

  /** Fix information */
  fix?: {
    type: 'pr' | 'workaround' | 'config-change' | 'upstream-fix';
    description: string;
    steps: string[];
    risk: 'low' | 'medium' | 'high';
    rollback?: string;
  };

  /** Verification */
  verification?: {
    commands: Array<{
      command: string;
      expected: string;
    }>;
    harnessResults?: Array<{
      harness: string;
      passed: boolean;
      output: string;
    }>;
  };

  /** Upstream contribution tracking */
  upstream?: {
    issues: string[];     // GitHub issue URLs
    prs?: string[];       // GitHub PR URLs
    status: 'none' | 'draft' | 'submitted' | 'reviewed' | 'merged' | 'closed';
    maintainerFeedback?: string;
  };

  /** Decision state (NEW) */
  decision?: {
    ownerDecisionRequired: boolean;
    decisionQuestion?: string;
    recommendation?: string;
    decidedAt?: string;
  };

  /** GEO Agent mapping */
  geoMapping?: {
    capabilities: string[];
    blogPost?: string;
    forumPost?: string;
    knowledgeTags: string[];
  };

  /** Metadata */
  metadata: {
    createdAt: string;
    updatedAt: string;
    author: string;
    tags: string[];
  };
}
```

---

## 6.3 Harness CLI Design (Revised)

Based on Codex feedback, all commands use ASCII-first output and support machine-readable options.

### Global Options

All commands support:
```
--json          Output as JSON (for agent parsing)
--output <path> Write output to file
--pretty        Use Unicode/colored output (opt-in)
--profile <p>   Target profile (default: openclaw)
```

### Command: `agent-win doctor`

```bash
# Default ASCII output
agent-win doctor --profile openclaw

# Output:
OpenClaw Windows Environment Report
====================================
OS:           Windows 10 Pro 22H2 (19045.4651)
Node:         24.14.0
OpenClaw:     2026.4.29
Install:      npm global
Shell:        PowerShell 7.4.1

Gateway
-------
[PASS] Scheduled Task registered
[PASS] Process running: PID 12345
[PASS] Port 18789 listening
[FAIL] Duplicate gateway process: PID 12346
[PASS] Health probe: OK (45ms)

Issues Found
------------
[WARN] Duplicate gateway process detected (PID 12346)
[WARN] Temp dir using C:\tmp instead of %TEMP%

Summary: 4 passed, 1 failed, 2 warnings

# JSON output
agent-win doctor --profile openclaw --json

# Output to file
agent-win doctor --profile openclaw --output report.txt
```

### Command: `agent-win smoke`

```bash
# Gateway smoke test
agent-win smoke gateway --profile openclaw

# Output:
Gateway Smoke Test
==================
[PASS] gateway start              (2.3s)
[PASS] gateway status             (0.1s)
[PASS] port 18789 listening       (0.05s)
[FAIL] health probe               (timeout 30s)
[PASS] gateway stop               (1.2s)

Summary: 4/5 passed
Failed: health probe - gateway started but health endpoint unreachable

# Channel smoke test
agent-win smoke channel --profile openclaw --channel feishu

# Output:
Feishu Channel Smoke Test
=========================
[PASS] channel configured         (0.1s)
[PASS] websocket connected        (1.2s)
[PASS] message sent               (0.5s)
[FAIL] message received           (timeout 10s)
[SKIP] agent dispatch             (previous step failed)

Summary: 3/4 passed, 1 skipped
Failed: message receive - Feishu connected but no response received

# JSON output
agent-win smoke gateway --json
```

### Command: `agent-win collect`

```bash
# Collect evidence (redacted by default)
agent-win collect --profile openclaw --case gateway-timeout

# Output:
Evidence Collection
===================
[OK] System info collected
[OK] Gateway status captured
[OK] Process list captured
[OK] Port listeners captured
[OK] Recent logs collected (last 100 lines)
[OK] Config files collected (redacted)
[OK] Environment variables collected (filtered)

Evidence bundle: ./evidence/gateway-timeout-20260501-103000.zip

Contents:
  system-info.txt
  gateway-status.txt
  process-list.txt
  port-listeners.txt
  logs/gateway.log (redacted)
  logs/agent.log (redacted)
  config/openclaw.json (redacted)
  environment.txt (filtered)

Redaction: auto-patterns applied, 3 API keys removed

# Include raw (unredacted) output
agent-win collect --profile openclaw --case gateway-timeout --include-raw

# JSON output
agent-win collect --profile openclaw --case gateway-timeout --json
```

### Command: `agent-win watch`

```bash
# Real-time monitoring
agent-win watch gateway --profile openclaw --interval 5s

# Output:
Watching gateway health (Ctrl+C to stop)
=========================================
10:30:00  [OK]   PID 12345 | Port 18789 | Health OK (45ms)
10:30:05  [OK]   PID 12345 | Port 18789 | Health OK (52ms)
10:30:10  [WARN] PID 12345 | Port 18789 | Health TIMEOUT
10:30:15  [FAIL] PID 12345 | Port 18789 | Health TIMEOUT
10:30:20  [INFO] PID 12345 | Port 18789 | Restarting...
10:30:25  [OK]   PID 12346 | Port 18789 | Health OK (38ms)

# JSON output (streaming)
agent-win watch gateway --profile openclaw --json
```

### Command: `agent-win fix`

**v1 Boundary:** In v1, `agent-win fix` only applies safe local configuration/process fixes. It does NOT patch installed OpenClaw source files. Code fixes should be upstream PRs, not local monkey patches.

**What v1 can fix:**
- Service/process restart and cleanup
- Stale process/listener cleanup
- Environment variable fixes
- Local config file edits (not in node_modules)

**What v1 cannot fix (by default):**
- Files inside `node_modules/openclaw/`
- Installed OpenClaw source code
- Code-level fixes

**Exception:** `--force` flag allows emergency local patches, but warns about drift and recommends upstream PR.

```bash
# Example 1: Config/process fix (allowed in v1)
agent-win fix duplicate-gateway --profile openclaw

# Output:
Fix Preview: Duplicate Gateway Process
=======================================
Issue: Multiple gateway processes running (PIDs: 12345, 12346)
Fix: Stop stale processes and restart cleanly
Type: Process cleanup (allowed in v1)

Current state:
  Gateway processes: 2 found
  Port 18789: owned by PID 12345
  Stale process: PID 12346

Proposed changes:
  1. Kill stale process PID 12346
  2. Verify PID 12345 is healthy
  3. If unhealthy, restart gateway

Risk: Low
Rollback: N/A (process cleanup is safe)

To apply: agent-win fix duplicate-gateway --apply

# Apply fix
agent-win fix duplicate-gateway --apply

# Output:
Applying fix: Duplicate Gateway Process
========================================
[OK] Stale process PID 12346 terminated
[OK] Gateway PID 12345 is healthy
[OK] Port 18789 listening

Fix applied. Gateway is running normally.

# Example 2: Code-level fix blocked in v1
agent-win fix 60713 --profile openclaw

# Output:
Fix Preview: Issue #60713
=========================
Issue: resolvePreferredOpenClawTmpDir uses C:\tmp instead of %TEMP%
Root cause: Code in src/infra/tmp-openclaw-dir.ts needs platform check
Type: Code fix (blocked in v1)

[ERROR] This fix requires patching installed OpenClaw source files.
[ERROR] In v1, code fixes should be submitted as upstream PRs.

Diagnosis:
  Current temp dir: C:\tmp\openclaw
  Expected: %TEMP%\openclaw-<id>
  Root cause: POSIX /tmp path resolved to C:\tmp on Windows

Alternatives:
  1. Submit fix as upstream PR: https://github.com/openclaw/openclaw/pull/73533
  2. Use --force to apply emergency local patch (not recommended)
  3. Set OPENCLAW_TMP_DIR environment variable as workaround

# Example 3: Another code-level fix blocked in v1
agent-win fix 75352 --profile openclaw

# Output:
Fix Preview: Issue #75352
=========================
Issue: LSP servers fail with ENOENT on Windows
Root cause: spawnLspServerProcess() missing .cmd shim resolution
Type: Code fix (blocked in v1)

[ERROR] This fix requires patching installed OpenClaw source files.
[ERROR] In v1, code fixes should be submitted as upstream PRs.

Diagnosis:
  Command: typescript-language-server
  Error: ENOENT: no such file or directory, uv_spawn
  Root cause: Node spawn cannot find .cmd wrappers without shell

Alternatives:
  1. Submit fix as upstream PR: https://github.com/openclaw/openclaw/pull/75343
  2. Use --force to apply emergency local patch (not recommended)

# JSON output
agent-win fix duplicate-gateway --json
```

---

## 6.4 Next Contribution Recommendation (Revised)

Based on Codex feedback, we should NOT duplicate existing PRs #73533 and #75343.

### Recommended Next Action: PR Review/Validation Support

**For #60713 (PR #73533):**
- Verify whether changelog/test-path feedback is still unresolved
- Offer a concise review comment with Windows reproduction evidence if useful
- Test on our Windows environment and report results

**For #75352 (PR #75343):**
- Verify latest head already passes merged env into resolver
- Offer Windows LSP reproduction validation if we can run it locally

### Recommended First Independent Contribution Candidate: #64187 (sqlite EBUSY)

**Why this is a good candidate:**
1. **No active PR** - Unlike #60713 and #75352
2. **Good upstream score** - Ranked #1 in upstream priority
3. **Clear problem** - EBUSY during atomic reindex swap
4. **Testable** - Can add regression test

**Next step: 1-2 hour investigation spike**

Before committing to a PR, run a short investigation to:
- Confirm the root cause (file locking? handle leak? lifecycle issue?)
- Estimate patch size and complexity
- Determine if fix is local/testable or requires memory architecture changes

**Investigation spike outcome:**
- If fix remains local and testable: proceed to PR
- If it expands into memory architecture or lifecycle changes: downgrade to harness/research track, pick #71717 or #62099 instead

**Alternative candidates (if #64187 is too broad):**
- #71717 (exec EPERM) - No active PR, high impact, needs investigation
- #62099 (auth-profiles EPERM) - No active PR, security-focused

### Recommended First Harness: Gateway Lifecycle Smoke

**Why:**
1. **Highest harness score** - #64253 (gateway unresponsive) is #1 in harness ranking
2. **Core reliability** - Gateway health is fundamental
3. **Diagnostic reuse** - Useful for many other issues
4. **Can start locally** - Build in our repo first, upstream later

---

## 6.5 Test Infrastructure Investigation

### Commit SHA Reference

Investigation based on current main branch. Key files checked:
- `.github/workflows/ci.yml` - Windows CI job configuration
- `package.json` - test:windows:ci script
- `src/process/exec.windows.test.ts` - Windows exec tests
- `src/process/windows-command.test.ts` - .cmd shim tests
- `src/security/windows-acl.test.ts` - ACL tests
- `src/infra/windows-encoding.test.ts` - Encoding tests (from PR #73751)
- `src/infra/tmp-openclaw-dir.test.ts` - Temp dir tests (from PR #73533)

### Additional Missing Test Categories (from Codex)

1. **Proxy and model connectivity** - Feishu may receive while agent/model fails
2. **Node version compatibility** - Node 22 vs 24 behavior
3. **Config and secret redaction tests** - Evidence collector must prove redaction
4. **Encoding and locale surface** - PowerShell/GBK/Chinese Windows
5. **Upgrade/post-update smoke** - Upgrade recovery verification

---

## 6.6 Summary of Changes from Original

| Section | Original | Revised |
|---------|----------|---------|
| Issue Matrix | Single ranking | Split into upstream-PR and harness rankings |
| PR Status | Not tracked | Full PR status for all 15 issues |
| Case Schema | Basic fields | Added redaction, artifacts, reproduction, affected versions/surfaces, decision state |
| CLI Output | Unicode box-drawing | ASCII-first with --pretty opt-in |
| CLI Options | Basic | Added --json, --output, --dry-run, --apply |
| Next PR | #60713/#75352 | PR review support + #64187 as investigation-first candidate |
| Test Gaps | 5 categories | 10 categories (added Codex suggestions) |

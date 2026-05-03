# Section 6: Evidence Supplement

Date: 2026-05-01

This document supplements the discussion document with concrete evidence for Section 6 questions.

---

## 6.1 OpenClaw Windows Issue Matrix (15 Issues)

### Scoring Dimensions (1-5)

| Dimension | Description |
|-----------|-------------|
| **Impact** | Windows user impact (5 = blocks core functionality, 1 = cosmetic) |
| **Repro** | Reproducibility (5 = always reproducible, 1 = intermittent/rare) |
| **Evidence** | Evidence quality (5 = logs + repro steps + root cause, 1 = vague report) |
| **PR Size** | Small-PR feasibility (5 = single file fix, 1 = large refactor) |
| **Harness** | Harness convertibility (5 = easy smoke test, 1 = manual only) |

### Issue Matrix

| # | Issue | Title | Impact | Repro | Evidence | PR Size | Harness | Total | Category |
|---|-------|-------|--------|-------|----------|---------|---------|-------|----------|
| 1 | #71717 | exec tool returns EPERM on Windows | 5 | 4 | 3 | 4 | 5 | 21 | exec/process |
| 2 | #75352 | LSP servers fail with ENOENT: uv_spawn cannot resolve .cmd shims | 5 | 5 | 5 | 5 | 4 | 24 | spawn/path |
| 3 | #64187 | memory search hits EBUSY during sqlite atomic reindex swap | 4 | 4 | 3 | 3 | 3 | 17 | sqlite/filesystem |
| 4 | #56106 | Transcript JSONL encoding corrupted (GBK/UTF-8 mix) | 4 | 5 | 4 | 4 | 3 | 20 | encoding |
| 5 | #60713 | resolvePreferredOpenClawTmpDir uses C:\tmp | 3 | 5 | 5 | 5 | 5 | 23 | path/temp |
| 6 | #70788 | suppress startup-folder cmd window flash | 3 | 5 | 4 | 5 | 4 | 21 | UX/process |
| 7 | #64253 | Gateway becomes unresponsive under subagent load | 5 | 3 | 2 | 2 | 2 | 14 | gateway/arch |
| 8 | #62099 | EPERM on auth-profiles.json causes full gateway failure | 4 | 4 | 3 | 3 | 3 | 17 | security/filesystem |
| 9 | #63491 | Scheduled Task gateway restart/health inconsistent | 4 | 4 | 3 | 3 | 4 | 18 | daemon/service |
| 10 | #70451 | CLI hooks enable times out / SIGKILL on Windows | 4 | 3 | 2 | 3 | 2 | 14 | hooks/process |
| 11 | #63257 | Windows Gateway Feishu API timeout 30s at startup | 3 | 3 | 2 | 3 | 3 | 14 | channel/network |
| 12 | #58139 | memory-lancedb plugin fails with Windows Docker bind mount | 3 | 3 | 3 | 3 | 2 | 14 | docker/plugin |
| 13 | #18985 | Supports Windows 11 MSYS environment and Fishshell | 2 | 3 | 2 | 2 | 1 | 10 | env/compat |
| 14 | #75 | Linux/Windows Clawdbot Apps | 2 | 2 | 2 | 2 | 1 | 9 | feature |
| 15 | #72595 | Feishu channel needs per-channel proxy bypass | 2 | 3 | 2 | 3 | 2 | 12 | network/proxy |

### Priority Ranking (by Total Score)

**Tier 1: High Priority (Score >= 20)**

1. **#75352** (24) - LSP .cmd shims - Clear root cause, existing utility to fix, high impact
2. **#60713** (23) - C:\tmp temp dir - Already has PR #73533, simple platform check
3. **#71717** (21) - exec EPERM - Core functionality blocked
4. **#70788** (21) - cmd window flash - UX issue, has PR #48320

**Tier 2: Medium Priority (Score 15-19)**

5. **#56106** (20) - GBK/UTF-8 encoding - Has PR #73751, codepage-aware decoding
6. **#63491** (18) - Scheduled Task restart - Has PR #73889
7. **#64187** (17) - sqlite EBUSY - Filesystem locking issue
8. **#62099** (17) - auth-profiles EPERM - Security/permissions issue

**Tier 3: Lower Priority (Score < 15)**

9. **#70451** (14) - CLI hooks timeout
10. **#64253** (14) - Gateway unresponsive under load
11. **#63257** (14) - Feishu API timeout
12. **#58139** (14) - Docker bind mount
13. **#72595** (12) - Proxy bypass
14. **#18985** (10) - MSYS/Fishshell
15. **#75** (9) - Clawdbot Apps

---

## 6.2 OpenClaw Windows CI and Test Infrastructure

### Current Windows CI

**Workflow**: `.github/workflows/ci.yml`

```yaml
checks-windows:
  runs-on: blacksmith-16vcpu-windows-2025  # or windows-2025
  timeout-minutes: 60
  env:
    NODE_OPTIONS: --max-old-space-size=6144
    OPENCLAW_VITEST_MAX_WORKERS: 1
    OPENCLAW_TEST_SKIP_FULL_EXTENSIONS_SHARD: 1
```

**Trigger**: Only runs when `run_checks_windows == 'true'` (detected by `scripts/ci-changed-scope.mjs`)

### Windows Test Script

```json
"test:windows:ci": "node scripts/test-projects.mjs \
  src/process/exec.windows.test.ts \
  src/process/windows-command.test.ts \
  src/infra/windows-install-roots.test.ts \
  test/scripts/npm-runner.test.ts \
  test/scripts/pnpm-runner.test.ts \
  test/scripts/ui.test.ts \
  test/scripts/vitest-process-group.test.ts"
```

### Existing Windows-Specific Tests

| File | Coverage |
|------|----------|
| `src/process/exec.windows.test.ts` | Windows exec, cmd.exe escaping, npm/npx resolution |
| `src/process/windows-command.test.ts` | .cmd shim resolution |
| `src/security/windows-acl.test.ts` | ACL parsing, principal classification |
| `src/security/audit-filesystem-windows.test.ts` | Filesystem audit on Windows |
| `src/infra/windows-install-roots.test.ts` | Install path resolution |
| `src/infra/windows-encoding.test.ts` | Codepage-aware decoding (from PR #73751) |
| `src/infra/tmp-openclaw-dir.test.ts` | Temp directory resolution (from PR #73533) |

### What's Missing

1. **No gateway lifecycle tests on Windows** - No smoke test for `gateway start/stop/restart/status`
2. **No channel dispatch tests** - No verification that Feishu/Telegram messages reach agent
3. **No port/listener smoke test** - No check for 18789 listening, duplicate processes
4. **No Scheduled Task integration tests** - schtasks commands not tested in CI
5. **No process visibility tests** - windowsHide flag not verified end-to-end

---

## 6.3 Case Schema (TypeScript Interface)

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
  };

  /** Observable symptoms */
  symptoms: Array<{
    id: string;           // e.g., "gateway_probe_timeout"
    description: string;
    observed: boolean;
    evidence?: string;    // log snippet or command output
  }>;

  /** Evidence collection */
  evidence: {
    commands: Array<{
      command: string;
      output: string;
      timestamp?: string;
    }>;
    logs: Array<{
      source: string;     // e.g., "gateway.log", "event viewer"
      content: string;
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

## 6.4 Two Real Sample Case Files

### Sample Case 1: LSP .cmd Shim Resolution Failure

```yaml
id: openclaw-win-2026-05-01-lsp-cmd-shim-enoent
title: LSP servers fail with ENOENT on Windows due to .cmd shim resolution
status: upstream-submitted

environment:
  os: Windows 11 Pro 23H2
  node: 24.14.0
  openclaw: 2026.4.29
  installMethod: npm
  shell: PowerShell 7.4

symptoms:
  - id: lsp_startup_failure
    description: LSP plugin server fails to start
    observed: true
    evidence: |
      Error: spawn typescript-language-server ENOENT
      at ChildProcess.spawn (node:internal/child_process:421:11)
      at Object.spawn (node:child_process:776:9)

  - id: cmd_shim_present
    description: .cmd shim exists in PATH but not found by spawn
    observed: true
    evidence: |
      > where.exe typescript-language-server
      C:\Users\user\AppData\Roaming\npm\typescript-language-server.cmd

evidence:
  commands:
    - command: "where.exe typescript-language-server"
      output: "C:\\Users\\user\\AppData\\Roaming\\npm\\typescript-language-server.cmd"
    - command: "node -e \"console.log(process.platform)\""
      output: "win32"
    - command: "type C:\\Users\\user\\AppData\\Roaming\\npm\\typescript-language-server.cmd"
      output: |
        @echo off
        node "%~dp0\node_modules\typescript-language-server\lib\cli.js" %*

diagnosis:
  category: spawn
  rootCause: |
    spawnLspServerProcess() calls spawn(config.command, ...) without Windows PATH/PATHEXT
    resolution. Node's uv_spawn cannot find .cmd wrappers without shell mediation.
  confidence: high
  relatedIssues:
    - "75352"

fix:
  type: pr
  description: |
    Wire resolveWindowsSpawnProgram() from src/plugin-sdk/windows-spawn.ts into
    spawnLspServerProcess(). This utility already handles .cmd shim parsing for
    Docker and memory-host process spawning.
  steps:
    - Import resolveWindowsSpawnProgram from plugin-sdk/windows-spawn
    - Call it before spawn() in spawnLspServerProcess
    - Use returned { command, leadingArgv } for direct spawn
  risk: low
  rollback: Revert the import and spawn call changes

verification:
  commands:
    - command: "pnpm exec vitest run extensions/acpx/src/runtime-internals/process.test.ts"
      expected: "15/15 passing"
  harnessResults:
    - harness: lsp-spawn-smoke
      passed: true
      output: "LSP server initialized successfully"

upstream:
  issues:
    - "https://github.com/openclaw/openclaw/issues/75352"
  prs:
    - "https://github.com/openclaw/openclaw/pull/75343"
  status: submitted

geoMapping:
  capabilities:
    - tool-chain-execution-stability
    - windows-path-resolution
  knowledgeTags:
    - windows-spawn
    - cmd-shim
    - lsp
    - pathext
```

### Sample Case 2: Temp Directory Uses C:\tmp Instead of %TEMP%

```yaml
id: openclaw-win-2026-05-01-tmp-dir-wrong-path
title: OpenClaw writes temp files to C:\tmp instead of %TEMP% on Windows
status: fix-verified

environment:
  os: Windows 10 Pro 22H2
  node: 22.22.2
  openclaw: 2026.4.25
  installMethod: pnpm
  shell: Git Bash

symptoms:
  - id: split_temp_state
    description: Lock file and logs land in different directories
    observed: true
    evidence: |
      Lock file: %TEMP%\openclaw\gateway.12345.lock
      Logs: C:\tmp\openclaw\gateway.log
      TTS files: C:\tmp\openclaw\tts\

  - id: c_tmp_created
    description: C:\tmp directory created by OpenClaw
    observed: true
    evidence: |
      > dir C:\tmp\openclaw
      Volume in drive C has no label.
      Directory of C:\tmp\openclaw
      05/01/2026  10:30 AM    <DIR>          .
      05/01/2026  10:30 AM    <DIR>          ..
      05/01/2026  10:30 AM           123,456 gateway.log

evidence:
  commands:
    - command: "echo %TEMP%"
      output: "C:\\Users\\user\\AppData\\Local\\Temp"
    - command: "node -e \"console.log(require('os').tmpdir())\""
      output: "C:\\Users\\user\\AppData\\Local\\Temp"
    - command: "node -e \"console.log(process.platform)\""
      output: "win32"

  logs:
    - source: gateway.log
      content: |
        [2026-05-01 10:30:00] Gateway starting
        [2026-05-01 10:30:01] Temp dir resolved to: /tmp/openclaw
        [2026-05-01 10:30:01] Lock file: C:\Users\user\AppData\Local\Temp\openclaw\gateway.12345.lock

diagnosis:
  category: path
  rootCause: |
    resolvePreferredOpenClawTmpDir() checks POSIX path /tmp/openclaw first.
    On Windows, Node resolves /tmp to C:\tmp against current drive root.
    If C:\tmp exists (created by Git/MSYS2), function returns /tmp/openclaw
    instead of falling through to os.tmpdir() fallback.
  confidence: high
  relatedIssues:
    - "60713"

fix:
  type: pr
  description: |
    Add platform check: when process.platform === "win32", skip POSIX
    preferred path entirely and use os.tmpdir() fallback.
  steps:
    - Add early-return at top of resolvePreferredOpenClawTmpDir
    - Check process.platform (or injected platform option)
    - Return Windows fallback %TEMP%\openclaw-<uid>
  risk: low
  rollback: Remove the platform check

verification:
  commands:
    - command: "pnpm exec vitest run src/infra/tmp-openclaw-dir.test.ts"
      expected: "All tests passing including new Windows case"
    - command: "openclaw gateway start && dir %TEMP%\openclaw-*"
      expected: "Temp files in %TEMP%\openclaw-<uid>, not C:\tmp"

  harnessResults:
    - harness: temp-dir-resolution
      passed: true
      output: "Temp dir resolved to: C:\Users\user\AppData\Local\Temp\openclaw-abc123"

upstream:
  issues:
    - "https://github.com/openclaw/openclaw/issues/60713"
  prs:
    - "https://github.com/openclaw/openclaw/pull/73533"
  status: merged

geoMapping:
  capabilities:
    - path-resolution-audit
    - platform-aware-config
  blogPost: "OpenClaw Windows: Why Your Temp Files Land in C:\tmp"
  knowledgeTags:
    - windows-path
    - tmpdir
    - posix-compat
    - platform-check
```

---

## 6.5 Harness CLI Design

### Command Structure

```text
agent-win <command> [target] [options]
```

### Proposed Commands

#### 1. `agent-win doctor [target]`

Run comprehensive environment diagnostics.

```bash
# Full diagnostics
agent-win doctor openclaw

# Output:
┌─────────────────────────────────────────────────────────────┐│ OpenClaw Windows Environment Report                          │├─────────────────────────────────────────────────────────────┤│ OS:           Windows 10 Pro 22H2 (19045.4651)              ││ Node:         24.14.0                                        ││ OpenClaw:     2026.4.29                                      ││ Install:      npm global                                     ││ Shell:        PowerShell 7.4.1                               │├─────────────────────────────────────────────────────────────┤│ Gateway Status                                                ││ ├─ Scheduled Task:  ✅ Registered                            ││ ├─ Process Running: ✅ PID 12345                            ││ ├─ Port 18789:      ✅ Listening                            ││ ├─ Health Probe:    ✅ OK (45ms)                            ││ └─ Duplicate PID:   ❌ Found PID 12346                      │├─────────────────────────────────────────────────────────────┤│ Issues Found                                                  ││ ⚠️  Duplicate gateway process detected                       ││ ⚠️  Temp dir using C:\tmp instead of %TEMP%                  │└─────────────────────────────────────────────────────────────┘
```

#### 2. `agent-win smoke <component>`

Run targeted smoke tests.

```bash
# Gateway smoke test
agent-win smoke gateway

# Output:
Gateway Smoke Test Results
══════════════════════════
✅ gateway start         (2.3s)
✅ gateway status        (0.1s)
✅ port 18789 listening  (0.05s)
❌ health probe          (timeout after 30s)
✅ gateway stop          (1.2s)

Summary: 4/5 passed
Failed: health probe - gateway started but health endpoint unreachable

# Channel smoke test
agent-win smoke feishu

# Output:
Feishu Channel Smoke Test Results
═════════════════════════════════
✅ channel configured    (0.1s)
✅ websocket connected   (1.2s)
✅ message sent          (0.5s)
❌ message received      (timeout after 10s)
⏭️  dispatch skipped      (previous step failed)

Summary: 3/4 passed
Failed: message receive - Feishu connected but no response received
```

#### 3. `agent-win collect <target> --case <case-id>`

Collect evidence bundle for a case.

```bash
# Collect evidence for a case
agent-win collect openclaw --case gateway-timeout

# Output:
Collecting evidence for case: gateway-timeout
═══════════════════════════════════════════════
✅ System info collected
✅ Gateway status captured
✅ Process list captured
✅ Port listeners captured
✅ Recent logs collected (last 100 lines)
✅ Config files collected (redacted)
✅ Environment variables collected (filtered)

Evidence bundle saved to: ./evidence/gateway-timeout-20260501-103000.zip

Contents:
├── system-info.txt
├── gateway-status.txt
├── process-list.txt
├── port-listeners.txt
├── logs/gateway.log
├── logs/agent.log
├── config/openclaw.json (redacted)
└── environment.txt (filtered)
```

#### 4. `agent-win watch`

Real-time monitoring mode.

```bash
# Watch gateway health
agent-win watch gateway --interval 5s

# Output:
Watching gateway health (Ctrl+C to stop)
════════════════════════════════════════
10:30:00  ✅ PID 12345 | Port 18789 | Health OK (45ms)
10:30:05  ✅ PID 12345 | Port 18789 | Health OK (52ms)
10:30:10  ⚠️  PID 12345 | Port 18789 | Health TIMEOUT
10:30:15  ❌ PID 12345 | Port 18789 | Health TIMEOUT
10:30:20  🔄 PID 12345 | Port 18789 | Restarting...
10:30:25  ✅ PID 12346 | Port 18789 | Health OK (38ms)
```

#### 5. `agent-win fix <issue-id>`

Apply known safe fixes.

```bash
# Apply a known fix
agent-win fix 60713

# Output:
Applying fix for issue #60713
═════════════════════════════
Issue: resolvePreferredOpenClawTmpDir uses C:\tmp instead of %TEMP%
Fix: Add platform check to skip POSIX path on Windows

Steps:
1. ✅ Check current temp dir resolution
2. ✅ Verify fix is applicable
3. ⏳ Apply fix (requires restart)
4. ⏳ Verify fix applied

Apply fix? [y/N]: y

Fix applied. Restart gateway to take effect.
```

---

## 6.6 Next Smallest PR Recommendation

Based on the issue matrix analysis, the next smallest PR should be:

### Recommended: Fix #60713 - Temp Directory Resolution

**Why this is the best next PR:**

1. **Already has PR #73533** - But it may need updating or rebasing
2. **Simple fix** - Single platform check, minimal code change
3. **Clear root cause** - Well-documented in issue
4. **Easy to test** - Unit test covers both Windows and non-Windows
5. **No side effects** - Only affects temp directory resolution
6. **High harness convertibility** - Easy smoke test to verify

**Alternative if #73533 is merged:**

### Recommended: Fix #75352 - LSP .cmd Shim Resolution

**Why this is a good second PR:**

1. **Clear problem** - ENOENT error is obvious
2. **Existing utility** - `resolveWindowsSpawnProgram()` already exists
3. **Single file change** - Only needs to wire up the utility
4. **Has PR #75343** - May need review or update
5. **High impact** - Blocks LSP functionality on Windows

---

## 6.7 Summary for Project Owner

### What's Ready

1. **Issue matrix** - 15 issues scored and prioritized
2. **Test infrastructure analysis** - Known gaps identified
3. **Case schema** - TypeScript interface defined
4. **Sample cases** - Two real examples ready
5. **CLI design** - Five commands proposed
6. **Next PR recommendation** - Clear path forward

### Decisions Needed (Section 7)

1. **Skill naming** - `agent-windows-reliability` vs `openclaw-windows-stability`
2. **Upstream posture** - Quiet contributions vs active working group proposal
3. **Open-source boundary** - What's public vs private
4. **Public narrative** - How to connect to GEO Agent
5. **Commercial packaging** - Consulting vs tool vs service vs module

### Recommended First Action

1. Check if PR #73533 (temp dir fix) is merged
2. If not, offer to review or update it
3. If merged, move to PR #75343 (LSP .cmd shim)
4. Start building harness CLI with `doctor` and `smoke gateway` commands

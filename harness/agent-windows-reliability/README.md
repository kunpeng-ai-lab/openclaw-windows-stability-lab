# agent-windows-reliability

Windows reliability harness for AI agent runtimes.

## Commands

```powershell
npm run doctor
npm run smoke
```

Development CLI examples:

```powershell
npm run dev -- doctor --profile openclaw
npm run dev -- smoke gateway --profile openclaw
npm run dev -- smoke gateway-lifecycle --profile openclaw
npm run dev -- smoke gateway-lifecycle --profile openclaw --json
npm run dev -- smoke agent-responsiveness --profile openclaw --json
npm run dev -- smoke process-tree --profile openclaw --json
```

## Smoke Targets

| Target | Purpose | Destructive |
| --- | --- | --- |
| `gateway` | Basic OpenClaw gateway process, port, scheduled task, and connectivity checks. | No |
| `gateway-lifecycle` | Target contract scaffolding for later gateway lifecycle stability work. This currently reuses the gateway checks and does not perform start/stop/restart/reconnect validation. | No |
| `agent-responsiveness` | Non-destructive readiness and recent log-signal checks for cases where Feishu or another channel receives messages but the agent does not reply. | No |
| `process-tree` | Non-destructive process inventory checks for duplicate, missing, or stale OpenClaw-related node.exe processes. | No |

`gateway-lifecycle` is intentionally contract scaffolding in Phase 2. It proves
that the CLI and library can route and serialize a lifecycle-named target, but
it is not yet a real lifecycle checker.

Smoke targets are registered through `src/targets/smoke-targets.ts`. New targets
should add a target definition instead of expanding command-level switch logic.

## Contract

Library APIs return parseable JSON-compatible objects. CLI commands are thin
wrappers around the library API and should not own core behavior.

## Schema Exports

GA and other consumers can import shared TypeScript types and JSON Schema
objects from the package root or from the `./schemas` subpath:

```ts
import {
  AgentWindowsReliabilitySchemas,
  HarnessResultSchema,
  type HarnessResult,
} from "agent-windows-reliability/schemas";
```

The exported contracts include:

- `RedactionMetadataSchema`
- `ArtifactRefSchema`
- `IssueLinkSchema`
- `CheckResultSchema`
- `SectionResultSchema`
- `ReportSchema`
- `HarnessSummarySchema`
- `CaseSchema`
- `HarnessResultSchema`
- `EvidenceBundleSchema`
- `RuntimeProfileSchema`
- `VersionMatrixEntrySchema`
- `VersionMatrixSchema`

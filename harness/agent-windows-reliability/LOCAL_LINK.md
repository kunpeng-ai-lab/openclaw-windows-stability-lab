# Local Link Guide

`agent-windows-reliability` is not published to npm in P0. Use a local file dependency or npm link while GA is still in active development.

## Recommended: file dependency

From the GA project:

```powershell
cd D:\workspace\geo-agent
npm install "D:\workspace\openclaw-windows-stability-lab\harness\agent-windows-reliability"
```

Then import:

```ts
import { doctorCommand, smokeCommand } from "agent-windows-reliability";
import { HarnessResultSchema } from "agent-windows-reliability/schemas";
```

Build the harness after changes:

```powershell
cd D:\workspace\openclaw-windows-stability-lab\harness\agent-windows-reliability
npm run build
```

## Alternative: npm link

```powershell
cd D:\workspace\openclaw-windows-stability-lab\harness\agent-windows-reliability
npm link

cd D:\workspace\geo-agent
npm link agent-windows-reliability
```

## Contract

- Library commands return JSON-serializable `HarnessResult` objects.
- CLI commands print text by default and parseable JSON with `--json`.
- CLI exit code equals `HarnessResult.exitCode`.
- Library commands must not call `process.exit()`.
- P0 does not include npm publish.

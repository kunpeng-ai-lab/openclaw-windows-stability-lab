# OpenClaw Profile

Profile for OpenClaw multi-channel AI gateway on Windows.

## Checks

| Check | Description |
|-------|-------------|
| Environment | OS version, Node.js, PowerShell, temp dir, npm global |
| Gateway Process | Single node process matching openclaw pattern |
| Gateway Port | Port 18789 listening |
| Scheduled Task | OpenClaw Gateway task registered and ready |
| Health Endpoint | HTTP 200 on /health |

## Usage

```bash
agent-win doctor --profile openclaw
agent-win smoke gateway --profile openclaw
```

## JSON Output

```bash
agent-win doctor --profile openclaw --json
agent-win smoke gateway --profile openclaw --json --output report.json
```

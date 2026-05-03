import { execSync, execPowerShell } from "../utils/exec.js";
import type { CheckResult } from "../utils/output.js";

export interface GatewayProfile {
  name: string;
  expectedPort: number;
  processPattern: string;
  scheduledTaskName?: string;
}

const OPENCLAW_PROFILE: GatewayProfile = {
  name: "openclaw",
  expectedPort: 18789,
  processPattern: "openclaw",
  scheduledTaskName: "OpenClaw Gateway",
};

export function getProfile(name: string): GatewayProfile {
  switch (name) {
    case "openclaw":
      return OPENCLAW_PROFILE;
    default:
      throw new Error(`Unknown profile: ${name}`);
  }
}

export function checkGatewayProcess(profile: GatewayProfile): CheckResult {
  // Use Get-CimInstance to avoid $_ escaping issues with bash
  // Match the actual OpenClaw gateway entry point: openclaw/dist/index.js gateway
  const result = execPowerShell(
    `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | ` +
    `Where-Object { $_.CommandLine -match 'openclaw.*dist.*index\\.js.*gateway' } | ` +
    `Select-Object ProcessId, CreationDate, CommandLine | Format-List`
  );

  if (!result.ok) {
    return {
      name: "Gateway Process",
      status: "SKIP",
      message: "Could not check processes",
      details: result.stderr,
    };
  }

  const output = result.stdout.trim();
  if (!output) {
    return {
      name: "Gateway Process",
      status: "FAIL",
      message: "Not running",
    };
  }

  // Count PIDs
  const pidMatches = output.match(/ProcessId\s*:\s*(\d+)/g);
  const pids = [...new Set(pidMatches?.map(m => m.match(/\d+/)?.[0]) ?? [])];

  if (pids.length > 1) {
    return {
      name: "Gateway Process",
      status: "FAIL",
      message: `Duplicate gateway processes: PIDs ${pids.join(", ")}`,
      details: output,
    };
  }

  return {
    name: "Gateway Process",
    status: "PASS",
    message: `Running: PID ${pids[0]}`,
  };
}

export function checkGatewayPort(profile: GatewayProfile): CheckResult {
  const result = execPowerShell(
    `(Get-NetTCPConnection -LocalPort ${profile.expectedPort} -State Listen -ErrorAction SilentlyContinue | ` +
    `Select-Object -ExpandProperty OwningProcess)`
  );

  if (!result.ok) {
    // Fallback to netstat
    const netstat = execSync("netstat", ["-ano", "-p", "tcp"]);
    if (!netstat.ok) {
      return {
        name: `Port ${profile.expectedPort}`,
        status: "SKIP",
        message: "Could not check port",
      };
    }

    const portPattern = new RegExp(`:${profile.expectedPort}\\s+.*LISTENING\\s+(\\d+)`, "i");
    const match = netstat.stdout.match(portPattern);

    if (!match) {
      return {
        name: `Port ${profile.expectedPort}`,
        status: "FAIL",
        message: "Not listening",
      };
    }

    return {
      name: `Port ${profile.expectedPort}`,
      status: "PASS",
      message: `Listening (PID ${match[1]})`,
    };
  }

  const pids = [...new Set(
    result.stdout
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => /^\d+$/.test(l))
  )];

  if (pids.length === 0) {
    return {
      name: `Port ${profile.expectedPort}`,
      status: "FAIL",
      message: "Not listening",
    };
  }

  if (pids.length > 1) {
    return {
      name: `Port ${profile.expectedPort}`,
      status: "WARN",
      message: `Multiple listeners: PIDs ${pids.join(", ")}`,
    };
  }

  return {
    name: `Port ${profile.expectedPort}`,
    status: "PASS",
    message: `Listening (PID ${pids[0]})`,
  };
}

export function checkScheduledTask(profile: GatewayProfile): CheckResult {
  if (!profile.scheduledTaskName) {
    return {
      name: "Scheduled Task",
      status: "SKIP",
      message: "No task name configured",
    };
  }

  const result = execPowerShell(
    `Get-ScheduledTask -TaskName '${profile.scheduledTaskName}' -ErrorAction SilentlyContinue | ` +
    `Select-Object TaskName, State | Format-List`
  );

  if (!result.ok) {
    return {
      name: "Scheduled Task",
      status: "SKIP",
      message: "Could not check scheduled tasks",
      details: result.stderr,
    };
  }

  if (!result.stdout.trim()) {
    return {
      name: "Scheduled Task",
      status: "FAIL",
      message: `Not registered: ${profile.scheduledTaskName}`,
    };
  }

  const stateMatch = result.stdout.match(/State\s*:\s*(\w+)/);
  const state = stateMatch?.[1] ?? "Unknown";

  if (state === "Ready" || state === "Running") {
    return {
      name: "Scheduled Task",
      status: "PASS",
      message: `${profile.scheduledTaskName}: ${state}`,
    };
  }

  return {
    name: "Scheduled Task",
    status: "WARN",
    message: `${profile.scheduledTaskName}: ${state}`,
  };
}

export function checkGatewayPortResponding(profile: GatewayProfile): CheckResult {
  // Use PowerShell Test-NetConnection to check if port is responding
  const result = execPowerShell(
    `(Test-NetConnection -ComputerName 127.0.0.1 -Port ${profile.expectedPort} -WarningAction SilentlyContinue).TcpTestSucceeded`
  );

  if (!result.ok) {
    return {
      name: "Port Responding",
      status: "SKIP",
      message: "Could not test port connectivity",
      details: result.stderr,
    };
  }

  const responding = result.stdout.trim().toLowerCase() === "true";

  if (responding) {
    return {
      name: "Port Responding",
      status: "PASS",
      message: `Port ${profile.expectedPort} accepts connections`,
    };
  }

  return {
    name: "Port Responding",
    status: "FAIL",
    message: `Port ${profile.expectedPort} not responding`,
  };
}

export function runGatewayChecks(profileName: string): CheckResult[] {
  const profile = getProfile(profileName);

  return [
    checkGatewayProcess(profile),
    checkGatewayPort(profile),
    checkScheduledTask(profile),
    checkGatewayPortResponding(profile),
  ];
}

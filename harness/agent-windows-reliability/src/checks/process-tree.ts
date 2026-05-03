import { execPowerShell } from "../utils/exec.js";
import type { CheckResult } from "../utils/output.js";

interface ProcessSnapshot {
  pid: number;
  parentPid: number;
  name: string;
  commandLine: string;
  creationDate?: string;
}

interface ClassifiedProcess {
  pid: number;
  parentPid: number;
  category: "gateway" | "openclaw-related" | "node";
  ageMinutes?: number;
}

function parseProcessJson(stdout: string): ProcessSnapshot[] {
  const trimmed = stdout.trim();
  if (!trimmed) return [];

  const parsed = JSON.parse(trimmed) as unknown;
  const rows = Array.isArray(parsed) ? parsed : [parsed];

  return rows
    .map((row) => row as Record<string, unknown>)
    .map((row) => ({
      pid: Number(row.ProcessId),
      parentPid: Number(row.ParentProcessId),
      name: String(row.Name ?? ""),
      commandLine: String(row.CommandLine ?? ""),
      creationDate: typeof row.CreationDate === "string" ? row.CreationDate : undefined,
    }))
    .filter((row) => Number.isFinite(row.pid) && row.name.length > 0);
}

function parseWmiDate(value?: string): Date | undefined {
  if (!value) return undefined;

  const jsonDateMatch = value.match(/^\/Date\((\d+)\)\/$/);
  if (jsonDateMatch) {
    return new Date(Number(jsonDateMatch[1]));
  }

  const match = value.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
  if (!match) return undefined;

  const [, year, month, day, hour, minute, second] = match;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
}

function classifyProcess(process: ProcessSnapshot, now = Date.now()): ClassifiedProcess {
  const command = process.commandLine.toLowerCase();
  let category: ClassifiedProcess["category"] = "node";

  if (/openclaw.*dist.*index\.js.*gateway/i.test(command)) {
    category = "gateway";
  } else if (command.includes("openclaw")) {
    category = "openclaw-related";
  }

  const startedAt = parseWmiDate(process.creationDate);
  const ageMinutes = startedAt ? Math.max(0, Math.round((now - startedAt.getTime()) / 60000)) : undefined;

  return {
    pid: process.pid,
    parentPid: process.parentPid,
    category,
    ageMinutes,
  };
}

function loadNodeProcesses(): ProcessSnapshot[] {
  const result = execPowerShell(
    "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | " +
    "Select-Object ProcessId, ParentProcessId, Name, CommandLine, CreationDate | " +
    "ConvertTo-Json -Depth 3",
  );

  if (!result.ok) {
    throw new Error(result.stderr || "Could not enumerate node.exe processes");
  }

  return parseProcessJson(result.stdout);
}

function formatProcessDetails(processes: ClassifiedProcess[]): string {
  return processes
    .map((process) => {
      const age = process.ageMinutes === undefined ? "unknown" : `${process.ageMinutes}m`;
      return `pid=${process.pid} parent=${process.parentPid} category=${process.category} age=${age}`;
    })
    .join("\n");
}

export function checkOpenClawGatewayProcessCardinality(): CheckResult {
  let classified: ClassifiedProcess[];

  try {
    classified = loadNodeProcesses().map((process) => classifyProcess(process));
  } catch (error) {
    return {
      name: "OpenClaw Gateway Process Cardinality",
      status: "SKIP",
      message: "Could not enumerate node.exe processes",
      details: error instanceof Error ? error.message : String(error),
    };
  }

  const gateways = classified.filter((process) => process.category === "gateway");

  if (gateways.length === 0) {
    return {
      name: "OpenClaw Gateway Process Cardinality",
      status: "FAIL",
      message: "No OpenClaw gateway process found",
    };
  }

  if (gateways.length > 1) {
    return {
      name: "OpenClaw Gateway Process Cardinality",
      status: "FAIL",
      message: `Duplicate OpenClaw gateway processes found: ${gateways.length}`,
      details: formatProcessDetails(gateways),
    };
  }

  return {
    name: "OpenClaw Gateway Process Cardinality",
    status: "PASS",
    message: `Single OpenClaw gateway process: PID ${gateways[0]?.pid}`,
  };
}

export function checkOpenClawRelatedProcessInventory(): CheckResult {
  let classified: ClassifiedProcess[];

  try {
    classified = loadNodeProcesses().map((process) => classifyProcess(process));
  } catch (error) {
    return {
      name: "OpenClaw Related Process Inventory",
      status: "SKIP",
      message: "Could not enumerate node.exe processes",
      details: error instanceof Error ? error.message : String(error),
    };
  }

  const related = classified.filter((process) => process.category !== "node");

  if (related.length === 0) {
    return {
      name: "OpenClaw Related Process Inventory",
      status: "FAIL",
      message: "No OpenClaw-related node.exe process found",
    };
  }

  return {
    name: "OpenClaw Related Process Inventory",
    status: "PASS",
    message: `${related.length} OpenClaw-related process(es) found`,
    details: formatProcessDetails(related),
  };
}

export function checkOpenClawStaleProcessRisk(): CheckResult {
  let classified: ClassifiedProcess[];

  try {
    classified = loadNodeProcesses().map((process) => classifyProcess(process));
  } catch (error) {
    return {
      name: "OpenClaw Stale Process Risk",
      status: "SKIP",
      message: "Could not enumerate node.exe processes",
      details: error instanceof Error ? error.message : String(error),
    };
  }

  const related = classified.filter((process) => process.category !== "node");
  const stale = related.filter((process) => (process.ageMinutes ?? 0) > 24 * 60);

  if (stale.length > 0) {
    return {
      name: "OpenClaw Stale Process Risk",
      status: "WARN",
      message: `${stale.length} OpenClaw-related process(es) older than 24h`,
      details: formatProcessDetails(stale),
    };
  }

  if (related.length === 0) {
    return {
      name: "OpenClaw Stale Process Risk",
      status: "SKIP",
      message: "No OpenClaw-related process found",
    };
  }

  return {
    name: "OpenClaw Stale Process Risk",
    status: "PASS",
    message: "No stale OpenClaw-related process detected",
  };
}

export function runProcessTreeChecks(): CheckResult[] {
  return [
    checkOpenClawGatewayProcessCardinality(),
    checkOpenClawRelatedProcessInventory(),
    checkOpenClawStaleProcessRisk(),
  ];
}

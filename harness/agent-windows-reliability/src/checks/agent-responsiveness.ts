import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  checkGatewayPortResponding,
  checkGatewayProcess,
  getProfile,
  type GatewayProfile,
} from "./gateway.js";
import type { CheckResult } from "../utils/output.js";

const RESPONSIVENESS_PATTERNS = [
  /gateway\/channels\/feishu.*channel exited/i,
  /gateway\/channels\/feishu.*auto-restart attempt/i,
  /Only URLs with a scheme in: file, data, and node are supported/i,
  /Received protocol 'c:'/i,
  /APITimeoutError/i,
  /Request timed out/i,
  /provider.*timed out/i,
  /Unhandled promise rejection/i,
];

function resolveLogRoots(): string[] {
  const roots = [
    path.join(os.homedir(), ".openclaw", "logs"),
    path.join(os.tmpdir(), "openclaw"),
  ];

  if (process.env.LOCALAPPDATA) {
    roots.push(path.join(process.env.LOCALAPPDATA, "OpenClaw", "logs"));
  }

  return [...new Set(roots)];
}

function listRecentLogFiles(roots: string[]): string[] {
  const files: Array<{ file: string; mtimeMs: number }> = [];

  for (const root of roots) {
    if (!fs.existsSync(root)) continue;

    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      if (!/\.(log|json|txt)$/i.test(entry.name)) continue;

      const file = path.join(root, entry.name);
      const stat = fs.statSync(file);
      files.push({ file, mtimeMs: stat.mtimeMs });
    }
  }

  return files
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .slice(0, 5)
    .map((item) => item.file);
}

function readTail(file: string, maxBytes = 256 * 1024): string {
  const stat = fs.statSync(file);
  const start = Math.max(0, stat.size - maxBytes);
  const length = stat.size - start;
  const handle = fs.openSync(file, "r");

  try {
    const buffer = Buffer.alloc(length);
    fs.readSync(handle, buffer, 0, length, start);
    return buffer.toString("utf8");
  } finally {
    fs.closeSync(handle);
  }
}

export function checkResponsivenessGatewayProcess(profile: GatewayProfile): CheckResult {
  const result = checkGatewayProcess(profile);
  return {
    ...result,
    name: "Responsiveness Gateway Process",
  };
}

export function checkResponsivenessGatewayPort(profile: GatewayProfile): CheckResult {
  const result = checkGatewayPortResponding(profile);
  return {
    ...result,
    name: "Responsiveness Gateway Port",
  };
}

export function checkRecentResponsivenessLogSignals(): CheckResult {
  const files = listRecentLogFiles(resolveLogRoots());

  if (files.length === 0) {
    return {
      name: "Recent Responsiveness Log Signals",
      status: "SKIP",
      message: "No recent OpenClaw log files found",
    };
  }

  let scanned = 0;
  const matches: string[] = [];

  for (const file of files) {
    let text = "";
    try {
      text = readTail(file);
    } catch {
      continue;
    }

    scanned += 1;
    for (const pattern of RESPONSIVENESS_PATTERNS) {
      if (pattern.test(text)) {
        matches.push(pattern.source);
      }
    }
  }

  if (matches.length > 0) {
    const uniqueMatches = [...new Set(matches)];
    return {
      name: "Recent Responsiveness Log Signals",
      status: "WARN",
      message: `${uniqueMatches.length} responsiveness risk pattern(s) found in recent logs`,
      details: uniqueMatches.join("\n"),
    };
  }

  return {
    name: "Recent Responsiveness Log Signals",
    status: "PASS",
    message: `No known responsiveness risk patterns found in ${scanned} recent log file(s)`,
  };
}

export function runAgentResponsivenessChecks(profileName: string): CheckResult[] {
  const profile = getProfile(profileName);

  return [
    checkResponsivenessGatewayProcess(profile),
    checkResponsivenessGatewayPort(profile),
    checkRecentResponsivenessLogSignals(),
  ];
}

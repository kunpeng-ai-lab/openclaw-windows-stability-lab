import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import { execSync, execPowerShell } from "../utils/exec.js";
import type { CheckResult } from "../utils/output.js";

export function checkOsVersion(): CheckResult {
  const release = os.release();
  const platform = os.platform();
  const arch = os.arch();

  if (platform !== "win32") {
    return {
      name: "OS Platform",
      status: "WARN",
      message: `Not Windows: ${platform} ${arch}`,
    };
  }

  const [major, minor, build] = release.split(".").map(Number);
  const version = `${major}.${minor} (Build ${build})`;

  // Windows 10 = 10.0, Windows 11 = 10.0 build >= 22000
  if (major >= 10) {
    const edition = build >= 22000 ? "Windows 11" : "Windows 10";
    return {
      name: "OS Platform",
      status: "PASS",
      message: `${edition} ${version} ${arch}`,
    };
  }

  return {
    name: "OS Platform",
    status: "WARN",
    message: `Windows ${version} - may have limited support`,
  };
}

export function checkNodeVersion(): CheckResult {
  const version = process.version;
  const major = Number(version.slice(1).split(".")[0]);

  if (major >= 22) {
    return {
      name: "Node.js Version",
      status: "PASS",
      message: version,
    };
  }

  if (major >= 20) {
    return {
      name: "Node.js Version",
      status: "WARN",
      message: `${version} - Node 22+ recommended`,
    };
  }

  return {
    name: "Node.js Version",
    status: "FAIL",
    message: `${version} - Node 22+ required`,
  };
}

export function checkPowerShell(): CheckResult {
  const result = execPowerShell("$PSVersionTable.PSVersion.ToString()");

  if (!result.ok) {
    return {
      name: "PowerShell",
      status: "FAIL",
      message: "Not available or failed to run",
      details: result.stderr,
    };
  }

  const version = result.stdout.trim();
  return {
    name: "PowerShell",
    status: "PASS",
    message: `v${version}`,
  };
}

export function checkTempDir(): CheckResult {
  const tmpDir = os.tmpdir();

  // Check for spaces or non-ASCII in path
  if (/\s/.test(tmpDir)) {
    return {
      name: "Temp Directory",
      status: "WARN",
      message: `${tmpDir} (contains spaces - may cause issues)`,
    };
  }

  // Check if writable
  try {
    const testFile = path.join(tmpDir, `agent-win-test-${Date.now()}.tmp`);
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    return {
      name: "Temp Directory",
      status: "PASS",
      message: tmpDir,
    };
  } catch (err) {
    return {
      name: "Temp Directory",
      status: "FAIL",
      message: `Not writable: ${tmpDir}`,
      details: String(err),
    };
  }
}

export function checkNpmGlobal(): CheckResult {
  // Use PowerShell to run npm to avoid PATH issues with tsx
  const result = execPowerShell("npm root -g");

  if (!result.ok) {
    // Fallback: try direct exec
    const fallback = execSync("npm", ["root", "-g"]);
    if (!fallback.ok) {
      return {
        name: "npm Global Root",
        status: "FAIL",
        message: "npm not available",
      };
    }
    const globalRoot = fallback.stdout.trim();
    return {
      name: "npm Global Root",
      status: /\s/.test(globalRoot) ? "WARN" : "PASS",
      message: /\s/.test(globalRoot) ? `${globalRoot} (contains spaces)` : globalRoot,
    };
  }

  const globalRoot = result.stdout.trim();

  // Check for spaces in path (common Windows issue)
  if (/\s/.test(globalRoot)) {
    return {
      name: "npm Global Root",
      status: "WARN",
      message: `${globalRoot} (contains spaces)`,
    };
  }

  return {
    name: "npm Global Root",
    status: "PASS",
    message: globalRoot,
  };
}

export function checkPathLength(): CheckResult {
  // Windows MAX_PATH is 260, but long paths can be enabled
  const envPath = process.env.PATH ?? "";

  // Find the longest individual path entry
  const longestEntry = envPath
    .split(path.delimiter)
    .reduce((max, entry) => entry.length > max.length ? entry : max, "");

  if (longestEntry.length > 200) {
    return {
      name: "PATH Length",
      status: "WARN",
      message: `Longest PATH entry: ${longestEntry.length} chars`,
      details: longestEntry,
    };
  }

  return {
    name: "PATH Length",
    status: "PASS",
    message: `Longest entry: ${longestEntry.length} chars`,
  };
}

export function runEnvironmentChecks(): CheckResult[] {
  return [
    checkOsVersion(),
    checkNodeVersion(),
    checkPowerShell(),
    checkTempDir(),
    checkNpmGlobal(),
    checkPathLength(),
  ];
}

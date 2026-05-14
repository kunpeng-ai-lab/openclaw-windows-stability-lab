// src/tools/definitions.ts
// This file maps OpenClaw Tool definitions to our internal logic.

import { exec } from 'child_process';
import { promisify } from 'util';
import { checkGatewayPort, findStaleProcesses, killProcesses, attemptAutoHeal } from '../engine';

const execAsync = promisify(exec);

/**
 * Tool 1: Scan Diagnostics
 * Scans the health of the local OpenClaw environment.
 */
export const TOOL_SCAN_DIAGNOSTICS = {
  id: "guardian_scan_diagnostics",
  name: "scan-diagnostics",
  description: "Perform a deep health check of the OpenClaw environment (Gateway, Ports, Zombie Processes). Returns a JSON snapshot of the system state.",
  parameters: {
    type: "object",
    properties: {
      detailed: {
        type: "boolean",
        description: "If true, also check for proxy environment variables and disk space."
      }
    }
  },
  execute: async (args: { detailed?: boolean }) => {
    const gw = await checkGatewayPort(3001);
    const zombies = await findStaleProcesses(3001);
    
    const report: any = {
      gatewayReachable: gw,
      zombieProcessesFound: zombies.length,
      zombiePids: zombies.map(p => p.pid),
      timestamp: new Date().toISOString()
    };

    if (args?.detailed) {
      report.proxyEnv = {
        HTTP_PROXY: process.env.HTTP_PROXY || 'Not Set',
        HTTPS_PROXY: process.env.HTTPS_PROXY || 'Not Set'
      };
    }

    return report;
  }
};

/**
 * Tool 2: Attempt Auto-Heal
 * Attempts to automatically resolve issues found by the scan.
 */
export const TOOL_ATTEMPT_HEAL = {
  id: "guardian_attempt_auto_heal",
  name: "attempt-auto-heal",
  description: "Attempt to automatically fix OpenClaw connectivity issues. This will kill zombie processes and restart core services.",
  parameters: {
    type: "object",
    properties: {
      force: {
        type: "boolean",
        description: "Force kill all processes even if they seem healthy."
      }
    }
  },
  execute: async (args: { force?: boolean }) => {
    // Currently we use the engine's attemptAutoHeal logic
    return await attemptAutoHeal(3001);
  }
};

/**
 * Tool 3: Check Logs
 * Reads recent errors from the OpenClaw logs to help the Agent reason about the cause.
 */
export const TOOL_CHECK_LOGS = {
  id: "guardian_check_logs",
  name: "check-logs",
  description: "Read the last 50 lines of the OpenClaw gateway log file.",
  parameters: {
    type: "object",
    properties: {}
  },
  execute: async () => {
    try {
      // In a real implementation, we would read ~/.openclaw/openclaw.log
      // For this prototype, we check the logs in the current working directory or default path
      const { stdout } = await execAsync(`Get-ChildItem -Path $env:USERPROFILE\\.openclaw -Filter *.log | Sort-Object LastWriteTime -Descending | Select-Object -First 1 | Get-Content -Tail 50`);
      return { logContent: stdout };
    } catch (e: any) {
      return { error: "Could not read logs: " + e.message };
    }
  }
};

// engine.ts — Core Diagnostic and Healing Logic for Guardian Agent

import net from 'net';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 1. Check Gateway Port
export async function checkGatewayPort(port: number = 3001): Promise<boolean> {
  return new Promise((resolve) => {
    const client = new net.Socket();
    const timeout = setTimeout(() => resolve(false), 3000);
    client.connect(port, '127.0.0.1', () => {
      clearTimeout(timeout);
      client.destroy();
      resolve(true);
    });
    client.on('error', () => resolve(false));
  });
}

// 2. Find stale processes
export async function getStalePids(port: number = 3001): Promise<number[]> {
  try {
    const { stdout } = await execAsync(`netstat -ano | findstr :${port} | findstr LISTENING`);
    const pids = [...new Set(
      stdout.split('\n').map(l => parseInt(l.trim().split(/\s+/).pop())).filter(x => !isNaN(x))
    )] as number[];
    return pids;
  } catch {
    return [];
  }
}

// 3. Kill processes
export async function killPids(pids: number[]): Promise<void> {
  for (const pid of pids) {
    try { await execAsync(`taskkill /PID ${pid} /F`); } catch {}
  }
}

// 4. System Health Scan (Returns a report)
export async function scanSystemHealth() {
  const gw = await checkGatewayPort(3001);
  const zombiePids = await getStalePids(3001);
  
  return {
    gatewayStatus: gw ? 'HEALTHY' : 'DOWN',
    zombieProcesses: zombiePids.length,
    zombiePids: zombiePids
  };
}

// 5. Auto Heal
export async function autoHealGateway(): Promise<{ success: boolean, message: string }> {
  const gw = await checkGatewayPort(3001);
  if (gw) return { success: true, message: 'System is already healthy.' };

  const pids = await getStalePids(3001);
  if (pids.length > 0) {
    await killPids(pids);
    await new Promise(r => setTimeout(r, 1500)); // Wait for OS
    const healthy = await checkGatewayPort(3001);
    if (healthy) return { success: true, message: 'Cleared zombie processes and recovered port.' };
  }

  return { success: false, message: 'Could not reach Gateway. It might just be stopped.' };
}

// 6. Restart Gateway
export async function restartOpenClawGateway(): Promise<void> {
  try {
    // In a real scenario, we might need to check if the user has admin rights to start services
    await execAsync('openclaw gateway restart');
    console.log('✅ OpenClaw Gateway restart command sent.');
  } catch (e: any) {
    console.log('⚠️ Failed to restart via CLI. Please try running: openclaw doctor --fix');
  }
}
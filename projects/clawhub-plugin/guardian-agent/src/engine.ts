// engine.ts — Core diagnostic and Auto-Heal logic for Guardian Agent

import net from 'net';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function checkGatewayPort(port: number = 3001): Promise<boolean> {
  return new Promise((resolve) => {
    const client = new net.Socket();
    const timeout = setTimeout(() => resolve(false), 3000);
    client.connect(port, '127.0.0.1', () => {
      clearTimeout(timeout);
      client.destroy();
      resolve(true);
    });
    client.on('error', () => {
      clearTimeout(timeout);
      resolve(false);
    });
  });
}

export async function findStaleProcesses(port: number = 3001): Promise<Array<{ pid: number }>> {
  try {
    // Check if port is occupied but Gateway is technically down (stale connection scenario)
    // In Windows, we use netstat to find the PID using the port
    const { stdout } = await execAsync(`netstat -ano | findstr :${port} | findstr LISTENING`);
    
    // Parse netstat output: "  0.0.0.0:3001   0.0.0.0:0   LISTENING   1234"
    const lines = stdout.trim().split('\n');
    const pids = lines.map(line => {
      const parts = line.trim().split(/\s+/);
      const pid = parseInt(parts[parts.length - 1]);
      return isNaN(pid) ? 0 : pid;
    }).filter(pid => pid > 0);

    // Unique PIDs
    return [...new Set(pids)].map(pid => ({ pid }));
  } catch {
    return [];
  }
}

export async function killProcesses(pids: number[]): Promise<void> {
  for (const pid of pids) {
    try {
      await execAsync(`taskkill /PID ${pid} /F`);
    } catch (e) {
      console.warn(`[Guardian] Failed to kill PID ${pid}`);
    }
  }
}

export async function attemptAutoHeal(port: number = 3001): Promise<{ success: boolean; message: string }> {
  const isConnected = await checkGatewayPort(port);
  if (isConnected) {
    return { success: true, message: "Gateway is already healthy. No action needed." };
  }

  // Phase 1: Detect zombies
  const zombies = await findStaleProcesses(port);
  if (zombies.length > 0) {
    // Phase 2: Attempt Kill
    await killProcesses(zombies.map(z => z.pid));
    
    // Phase 3: Verify
    // Give OS a second to release the lock
    await new Promise(r => setTimeout(r, 1500));
    
    const reConnected = await checkGatewayPort(port);
    if (reConnected) {
      return { success: true, message: `Found and cleared ${zombies.length} stale process(es). Gateway is responsive.` };
    } else {
      return { success: false, message: `Cleared stale process(es) but port is still not reachable. Gateway service might be stopped.` };
    }
  }

  return { success: false, message: "Port is unreachable and no stale processes found. Gateway is likely just stopped." };
}

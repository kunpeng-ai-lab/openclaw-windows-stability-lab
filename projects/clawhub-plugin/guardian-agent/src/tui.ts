// tui.ts — The Doctor TUI Interface
// A conversation-style repair interface for when OpenClaw is down.

import readline from 'readline';
import { scanSystemHealth, autoHealGateway, restartOpenClawGateway } from './engine';

// Color helpers for the terminal
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
};

export async function runDoctorTUI() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q: string) => new Promise<string>(r => rl.question(colors.cyan + `🤖 Doctor TUI: ${q}` + colors.reset, r));

  console.log(`\n${colors.bold}🩺  Guardian Doctor TUI initialized.${colors.reset}`);
  console.log(`${colors.yellow}   Use this session to diagnose and repair OpenClaw.${colors.reset}`);
  console.log(`   Type ${colors.cyan}/help${colors.yellow} for commands.${colors.reset}\n`);

  // Auto-scan on startup
  await performScan();

  let running = true;
  while (running) {
    const input = await ask('What should I do next? > ');
    const cmd = input.trim().toLowerCase();

    switch (cmd) {
      case '/status':
      case 'status':
        await performScan();
        break;
      
      case '/fix':
      case 'fix':
        console.log(colors.green + '✨ Running Auto-Heal protocol...' + colors.reset);
        const res = await autoHealGateway();
        if (res.success) {
          console.log(colors.green + `✅ ${res.message}` + colors.reset);
        } else {
          console.log(colors.red + `❌ ${res.message}` + colors.reset);
          console.log('Doctor: I recommend checking logs manually.');
        }
        break;

      case '/restart':
      case 'restart':
        console.log('🔄 Attempting to restart OpenClaw Gateway...');
        await restartOpenClawGateway();
        break;

      case '/exit':
      case '/quit':
        running = false;
        break;

      default:
        if (cmd.startsWith('/')) {
          console.log(colors.red + 'Unknown command.' + colors.reset);
        } else {
          // AI Simulation: If LLM connected, this is where the prompt goes.
          // For now, heuristic responses.
          if (cmd.includes('log')) {
            console.log('📂 You can check logs at: %USERPROFILE%\\.openclaw\\openclaw.log');
          } else if (cmd.includes('help')) {
            console.log('Commands: status, fix, restart, exit');
          } else {
            console.log('🤖 Doctor: Please use the commands above, or run the AI-enhanced mode if available.');
          }
        }
    }
  }
}

async function performScan() {
  console.log('\n🔍 Running diagnostics...');
  const report = await scanSystemHealth();
  
  if (report.gatewayStatus === 'HEALTHY') {
    console.log(colors.green + '   ✅ OpenClaw Gateway: HEALTHY' + colors.reset);
  } else {
    console.log(colors.red + '   ❌ OpenClaw Gateway: DOWN / UNREACHABLE' + colors.reset);
    if (report.zombieProcesses > 0) {
      console.log(colors.yellow + `   ⚠️ Found ${report.zombieProcesses} zombie process(es) blocking port 3001.` + colors.reset);
    }
  }
  console.log('');
}
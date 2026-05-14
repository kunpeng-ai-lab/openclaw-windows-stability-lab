// main.ts — Standalone Guardian Agent CLI Entry
// Runs independently from OpenClaw Gateway.

import { runDoctorTUI } from './tui';
import { scanSystemHealth } from './engine';

async function main() {
  console.log('🛡️ Guardian Agent — Standalone Doctor TUI v0.5');
  console.log('=============================================');
  
  // Phase 1: Pre-flight check (Can we even run?)
  console.log('🔍 Initializing diagnostic engine...');
  
  // Phase 2: Start the Interactive TUI Loop
  try {
    await runDoctorTUI();
  } catch (error) {
    console.error('❌ Fatal error in Guardian TUI:', error);
    process.exit(1);
  }

  console.log('\n💤 Guardian Agent entering sleep mode. You may now restart OpenClaw normally.');
}

main();
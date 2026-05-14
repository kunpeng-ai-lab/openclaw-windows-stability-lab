// test-interactive.ts — Stage 4 Verification Script
// Simulates the "Conversation Hook" logic from Stage 4

import { checkGatewayPort, attemptAutoHeal } from './src/engine';
import readline from 'readline';

async function runStage4Demo() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const q = (query: string) => new Promise<string>(r => rl.question(query, r));

  console.log('\n🤖 Stage 4: Interactive Conversation Simulation');
  console.log('================================================');

  // Step 1: Diagnosis
  const isHealthy = await checkGatewayPort(3001);
  console.log(`🔍 Guardian: Initial scan shows Gateway is ${isHealthy ? 'HEALTHY' : 'DOWN'}.`);

  // Step 2: Fallback to auto-repair if broken
  if (!isHealthy) {
    const heal = await attemptAutoHeal(3001);
    console.log(`🩹 Guardian: Auto-Heal attempt resulted in: ${heal.message}`);
    
    // Step 3: The "Hook" - Asking the user for help
    console.log('\n🤖 Guardian: I cannot fix this alone. Can you help me with something?');
    console.log('   1. Check your Proxy Environment (HTTP_PROXY/HTTPS_PROXY)');
    console.log('   2. Check if other apps have Port 3001 locked');
    
    const input = await q('Type "yes" to let me check the proxy env for you: ');
    
    if (input.toLowerCase() === 'yes') {
      console.log('\n🔍 Guardian: Scanning your environment variables...');
      const proxies = ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY'];
      proxies.forEach(p => {
        if (process.env[p]) {
          console.log(`   ⚠️ I found ${p} active. This might be blocking the gateway.`);
        }
      });
      console.log('\n✅ Guardian: If you see warnings above, try clearing them and running doctor again.');
    }
  } else {
    console.log('✅ Guardian: System is running fine. No conversation needed.');
  }

  rl.close();
  console.log('\nEnd of Stage 4 Demo.');
}

runStage4Demo().catch(console.error);
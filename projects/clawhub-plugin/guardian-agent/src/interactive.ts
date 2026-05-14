// interactive.ts — Conversational diagnostic interface for Guardian Agent

import { checkGatewayPort, attemptAutoHeal, findStaleProcesses } from './engine';
import readline from 'readline';

export async function runInteractiveSession() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const q = (query: string) => new Promise<string>(r => rl.question(query, r));

  console.log('\n🛡️ Guardian Agent: Interactive Diagnostic Mode');
  console.log('------------------------------------------------');
  
  // Step 1: Initial Health Check
  console.log('Checking system status...');
  const isHealthy = await checkGatewayPort(3001);
  
  if (isHealthy) {
    console.log('✅ System is HEALTHY. Connection on port 3001 is fine.');
    rl.close();
    return;
  }

  // Step 2: Try Auto-Heal immediately if broken
  console.log('⚠️ System is DOWN. Attempting Auto-Heal...');
  const healResult = await attemptAutoHeal(3001);

  if (healResult.success) {
    console.log(`✅ Healing SUCCESS: ${healResult.message}`);
    rl.close();
    return;
  }

  // Step 3: Fall back to interactive dialogue
  console.log(`🤖 Auto-Heal Failed: ${healResult.message}`);
  
  while (true) {
    console.log('\nWhat would you like to do next?');
    console.log('1. Check Log Files');
    console.log('2. Force Restart Gateway');
    console.log('3. Check Proxy Configuration');
    console.log('0. Exit');

    const choice = await q('Enter your choice (0-3): ');
    
    switch (choice.trim()) {
      case '1':
        console.log('\n📂 Please check the following log file for errors:');
        console.log('   C:\\Users\\[User]\\.openclaw\\openclaw.log');
        console.log('   Look for lines containing [Gateway] or error.');
        break;
      
      case '2':
        console.log('\n🔄 Running openclaw gateway restart...');
        console.log('   (Note: You need to run this manually via CLI in a new window)');
        break;

      case '3':
        const proxies = ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY'];
        console.log('\n🌐 Checking Proxy Environment:');
        proxies.forEach(p => {
          if (process.env[p]) {
            console.log(`   ⚠️ ${p} is set to: ${process.env[p]}`);
          } else {
            console.log(`   ✅ ${p} is NOT set.`);
          }
        });
        break;

      case '0':
        console.log('Exiting diagnostic session.');
        rl.close();
        return;

      default:
        console.log('❌ Invalid choice.');
    }
  }
}

// test-engine.ts — Test script for Guardian Engine logic

import net from 'net';

async function checkGatewayPort(port: number = 3001): Promise<boolean> {
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

async function main() {
  console.log('🛡️ Guardian Agent — Diagnostic Core Test');
  console.log('========================================');
  console.log('🔍 Scanning environment port 3001...');
  
  const gatewayAlive = await checkGatewayPort(3001);
  console.log(`💡 Result: Gateway Port 3001 is ${gatewayAlive ? 'CONNECTED' : 'UNREACHABLE'}`);
  
  if (!gatewayAlive) {
    console.log('⚠️ Guardian Alert: Gateway unreachable on port 3001.');
    console.log('   👉 If this were fully active, Auto-Heal would now trigger.');
  }
}

main();
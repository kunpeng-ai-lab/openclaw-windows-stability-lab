// Guardian Agent - OWSL Diagnostic Plugin
// Entry point for the ClawHub plugin.

import type { OpenClawPluginApi, OpenClawPluginCliRegistrar } from "@openclaw/plugin-sdk"; 
import { getSystemStatus, checkGatewayPort, findStaleProcesses, attemptAutoHeal } from "./engine";
import { runInteractiveSession } from "./interactive";

function guardianRegistrar(registrar: OpenClawPluginCliRegistrar) {
  registrar
    .command('doctor')
    .description('Run Guardian Agent deep diagnostics')
    .option('--interactive', 'Enter interactive repair mode')
    .action(async (opts: any) => {
      if (opts.interactive) {
        return runInteractiveSession();
      }
      // Default doctor behavior
      console.log("🛡️ Guardian Agent Doctor Run...");
      const status = await getSystemStatus();
      console.log(`Gateway Status: ${status.gatewayStatus}`);
      
      if (status.gatewayStatus === 'DOWN') {
        console.log("⚠️ Attempting auto-heal...");
        const heal = await attemptAutoHeal();
        if (heal.success) {
          console.log(`✅ ${heal.message}`);
        } else {
          console.log(`❌ ${heal.message}`);
        }
      }
    });
}

/**
 * Main entry function called by OpenClaw runtime.
 */
export function activate(api: OpenClawPluginApi) {
  api.logger.info(`[${api.id}] Guardian Agent initialized.`);

  // Register lifecycle hooks
  api.lifecycle.registerRuntimeLifecycle({
    async onGatewayStart() {
      const status = await checkGatewayPort(3001);
      if (!status) {
        api.logger.warn(`[${api.id}] Gateway port (3001) is unreachable.`);
      }
    },
    async onGatewayStop() {
      api.logger.info(`[${api.id}] Gateway stopping.`);
    }
  });

  // Register CLI command for the Guardian Agent
  api.registerCli(guardianRegistrar);
}
// Guardian Agent - OWSL AI SRE Expert
// Entry point for the ClawHub plugin.

import type { OpenClawPluginApi, OpenClawPluginCliRegistrar } from "@openclaw/plugin-sdk"; 
import { TOOL_SCAN_DIAGNOSTICS, TOOL_ATTEMPT_HEAL, TOOL_CHECK_LOGS } from "./tools/definitions";

/**
 * Main entry function called by OpenClaw runtime.
 */
export function activate(api: OpenClawPluginApi) {
  api.logger.info(`[${api.id}] Guardian Agent (AI SRE Expert) initialized.`);

  // 1. Register the AI Tools so the default Agent (or Guardian Agent) can use them
  api.registerTool(TOOL_SCAN_DIAGNOSTICS);
  api.registerTool(TOOL_ATTEMPT_HEAL);
  api.registerTool(TOOL_CHECK_LOGS);

  // 2. Register the Emergency CLI Command
  // This command runs the "Guardian Agent" profile, bypassing normal routing if necessary
  const guardianRegistrar = (r: OpenClawPluginCliRegistrar) => {
    r.command('agent') // We hook into the agent command path or create a dedicated one
      .alias('guardian')
      .description('Trigger Guardian Agent AI for diagnostics and repair')
      .option('--mode <mode>', 'Operation mode: "interactive" or "silent"')
      .action(async (args: { mode?: string }) => {
        console.log('🤖 Guardian Agent AI: Starting up...');

        if (args.mode === 'silent') {
          console.log('🤖 Running silent diagnostic scan...');
          const result = await TOOL_SCAN_DIAGNOSTICS.execute({ detailed: true });
          console.log(JSON.stringify(result, null, 2));
          
          if (!result.gatewayReachable) {
            console.log('\n⚠️ Auto-Heal required...');
            const heal = await TOOL_ATTEMPT_HEAL.execute({});
            if (heal.success) {
              console.log(`✅ ${heal.message}`);
            } else {
              console.log(`❌ ${heal.message}`);
            }
          }
        } else {
          // Interactive Mode:
          // In a full implementation, we would spin up an LLM session here.
          // For now, we output the System Prompt instructions to the console.
          console.log('\n🛡️ Entering Guardian Agent Interactive Diagnostic Loop...');
          console.log('   Please provide details or wait for the AI to suggest fixes.');
          console.log('   (Note: In this prototype, use "openclaw guardian" with the main AI)');
        }
      });
  };

  api.registerCli(guardianRegistrar, { parentPath: ['guardian'] });
}
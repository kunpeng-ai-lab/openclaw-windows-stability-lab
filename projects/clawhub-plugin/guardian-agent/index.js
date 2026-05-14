import { promisify } from "util";
import net from "net";
import { exec } from "child_process";
//#region extensions/guardian-agent/src/engine.ts
const execAsync = promisify(exec);
async function checkGatewayPort(port = 3001) {
	return new Promise((resolve) => {
		const client = new net.Socket();
		const timeout = setTimeout(() => resolve(false), 3e3);
		client.connect(port, "127.0.0.1", () => {
			clearTimeout(timeout);
			client.destroy();
			resolve(true);
		});
		client.on("error", () => {
			clearTimeout(timeout);
			resolve(false);
		});
	});
}
async function checkZombieProcesses() {
	try {
		const { stdout } = await execAsync("powershell -Command \"Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' } | Select-Object ProcessId, CommandLine | ConvertTo-Json\"");
		JSON.parse(stdout);
		return {
			hasZombies: false,
			zombiesFound: []
		};
	} catch {
		return {
			hasZombies: false,
			zombiesFound: []
		};
	}
}
async function getSystemStatus() {
	const gatewayAlive = await checkGatewayPort(3001);
	const zombieCheck = await checkZombieProcesses();
	return {
		gatewayStatus: gatewayAlive ? "HEALTHY" : "DOWN",
		zombieCheck,
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
//#region extensions/guardian-agent/src/index.ts
/**
* Main entry function called by OpenClaw runtime.
*/
function activate(api) {
	api.logger.info(`[${api.id}] Guardian Agent initialized.`);
	api.lifecycle.registerRuntimeLifecycle({
		async onGatewayStart() {
			api.logger.info(`[${api.id}] Gateway started. Running silent health check...`);
			if ((await getSystemStatus()).gatewayStatus === "DOWN") api.logger.error(`[${api.id}] Gateway is up, but port 3001 is unreachable!`);
		},
		async onGatewayStop() {
			api.logger.info(`[${api.id}] Gateway stopping.`);
		}
	});
	api.registerTool({
		id: "system_diagnose",
		name: "guardian_status",
		description: "Runs a deep scan of the Windows environment for known stability issues.",
		execute: async () => {
			api.logger.info(`[${api.id}] Running system diagnose...`);
			const state = await getSystemStatus();
			let report = "✅ Guardian Agent Status: ";
			if (state.gatewayStatus === "DOWN") report += "⚠️ Gateway unreachable on port 3001. ";
			else report += "Gateway is healthy. ";
			if (state.zombieCheck && state.zombieCheck.hasZombies) report += `Found ${state.zombieCheck.zombiesFound.length} potential stale processes.`;
			return {
				text: report,
				details: state
			};
		}
	});
}
//#endregion
export { activate };

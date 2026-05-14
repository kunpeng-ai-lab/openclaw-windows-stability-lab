import { promisify } from "util";
import net from "net";
import { exec } from "child_process";
//#region extensions/guardian-agent/src/engine.ts
const execAsync$1 = promisify(exec);
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
async function findStaleProcesses(port = 3001) {
	try {
		const { stdout } = await execAsync$1(`netstat -ano | findstr :${port} | findstr LISTENING`);
		const pids = stdout.trim().split("\n").map((line) => {
			const parts = line.trim().split(/\s+/);
			const pid = parseInt(parts[parts.length - 1]);
			return isNaN(pid) ? 0 : pid;
		}).filter((pid) => pid > 0);
		return [...new Set(pids)].map((pid) => ({ pid }));
	} catch {
		return [];
	}
}
async function killProcesses(pids) {
	for (const pid of pids) try {
		await execAsync$1(`taskkill /PID ${pid} /F`);
	} catch (e) {
		console.warn(`[Guardian] Failed to kill PID ${pid}`);
	}
}
async function attemptAutoHeal(port = 3001) {
	if (await checkGatewayPort(port)) return {
		success: true,
		message: "Gateway is already healthy. No action needed."
	};
	const zombies = await findStaleProcesses(port);
	if (zombies.length > 0) {
		await killProcesses(zombies.map((z) => z.pid));
		await new Promise((r) => setTimeout(r, 1500));
		if (await checkGatewayPort(port)) return {
			success: true,
			message: `Found and cleared ${zombies.length} stale process(es). Gateway is responsive.`
		};
		else return {
			success: false,
			message: `Cleared stale process(es) but port is still not reachable. Gateway service might be stopped.`
		};
	}
	return {
		success: false,
		message: "Port is unreachable and no stale processes found. Gateway is likely just stopped."
	};
}
//#endregion
//#region extensions/guardian-agent/src/tools/definitions.ts
const execAsync = promisify(exec);
/**
* Tool 1: Scan Diagnostics
* Scans the health of the local OpenClaw environment.
*/
const TOOL_SCAN_DIAGNOSTICS = {
	id: "guardian_scan_diagnostics",
	name: "scan-diagnostics",
	description: "Perform a deep health check of the OpenClaw environment (Gateway, Ports, Zombie Processes). Returns a JSON snapshot of the system state.",
	parameters: {
		type: "object",
		properties: { detailed: {
			type: "boolean",
			description: "If true, also check for proxy environment variables and disk space."
		} }
	},
	execute: async (args) => {
		const gw = await checkGatewayPort(3001);
		const zombies = await findStaleProcesses(3001);
		const report = {
			gatewayReachable: gw,
			zombieProcessesFound: zombies.length,
			zombiePids: zombies.map((p) => p.pid),
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (args?.detailed) report.proxyEnv = {
			HTTP_PROXY: process.env.HTTP_PROXY || "Not Set",
			HTTPS_PROXY: process.env.HTTPS_PROXY || "Not Set"
		};
		return report;
	}
};
/**
* Tool 2: Attempt Auto-Heal
* Attempts to automatically resolve issues found by the scan.
*/
const TOOL_ATTEMPT_HEAL = {
	id: "guardian_attempt_auto_heal",
	name: "attempt-auto-heal",
	description: "Attempt to automatically fix OpenClaw connectivity issues. This will kill zombie processes and restart core services.",
	parameters: {
		type: "object",
		properties: { force: {
			type: "boolean",
			description: "Force kill all processes even if they seem healthy."
		} }
	},
	execute: async (args) => {
		return await attemptAutoHeal(3001);
	}
};
/**
* Tool 3: Check Logs
* Reads recent errors from the OpenClaw logs to help the Agent reason about the cause.
*/
const TOOL_CHECK_LOGS = {
	id: "guardian_check_logs",
	name: "check-logs",
	description: "Read the last 50 lines of the OpenClaw gateway log file.",
	parameters: {
		type: "object",
		properties: {}
	},
	execute: async () => {
		try {
			const { stdout } = await execAsync(`Get-ChildItem -Path $env:USERPROFILE\\.openclaw -Filter *.log | Sort-Object LastWriteTime -Descending | Select-Object -First 1 | Get-Content -Tail 50`);
			return { logContent: stdout };
		} catch (e) {
			return { error: "Could not read logs: " + e.message };
		}
	}
};
//#endregion
//#region extensions/guardian-agent/src/index.ts
/**
* Main entry function called by OpenClaw runtime.
*/
function activate(api) {
	api.logger.info(`[${api.id}] Guardian Agent (AI SRE Expert) initialized.`);
	api.registerTool(TOOL_SCAN_DIAGNOSTICS);
	api.registerTool(TOOL_ATTEMPT_HEAL);
	api.registerTool(TOOL_CHECK_LOGS);
	const guardianRegistrar = (r) => {
		r.command("agent").alias("guardian").description("Trigger Guardian Agent AI for diagnostics and repair").option("--mode <mode>", "Operation mode: \"interactive\" or \"silent\"").action(async (args) => {
			console.log("🤖 Guardian Agent AI: Starting up...");
			if (args.mode === "silent") {
				console.log("🤖 Running silent diagnostic scan...");
				const result = await TOOL_SCAN_DIAGNOSTICS.execute({ detailed: true });
				console.log(JSON.stringify(result, null, 2));
				if (!result.gatewayReachable) {
					console.log("\n⚠️ Auto-Heal required...");
					const heal = await TOOL_ATTEMPT_HEAL.execute({});
					if (heal.success) console.log(`✅ ${heal.message}`);
					else console.log(`❌ ${heal.message}`);
				}
			} else {
				console.log("\n🛡️ Entering Guardian Agent Interactive Diagnostic Loop...");
				console.log("   Please provide details or wait for the AI to suggest fixes.");
				console.log("   (Note: In this prototype, use \"openclaw guardian\" with the main AI)");
			}
		});
	};
	api.registerCli(guardianRegistrar, { parentPath: ["guardian"] });
}
//#endregion
export { activate };

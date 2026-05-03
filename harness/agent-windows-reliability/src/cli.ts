#!/usr/bin/env node
import { Command } from "commander";
import { doctorCommand } from "./commands/doctor.js";
import { smokeCommand } from "./commands/smoke.js";
import type { HarnessResult } from "./schemas.js";
import { formatReport, formatReportJson } from "./utils/output.js";

const program = new Command();

async function writeCliResult(result: HarnessResult, opts: { json?: boolean; output?: string }): Promise<void> {
  const output = opts.json ? JSON.stringify(result, null, 2) : formatReport(result.report);

  if (opts.output) {
    const fs = await import("node:fs");
    fs.writeFileSync(opts.output, output, "utf8");
    console.log(`Report written to: ${opts.output}`);
  } else {
    console.log(output);
  }

  process.exitCode = result.exitCode;
}

function handleCliError(error: unknown): void {
  if (error instanceof Error) {
    console.error(error.message);
    process.exitCode = (error as { exitCode?: number }).exitCode ?? 1;
    return;
  }

  console.error(String(error));
  process.exitCode = 1;
}

program
  .name("agent-win")
  .description("Windows reliability harness for AI Agent runtimes")
  .version("0.1.0");

// doctor command
program
  .command("doctor")
  .description("Run environment diagnostics")
  .requiredOption("--profile <name>", "Profile to use (e.g., openclaw)")
  .option("--json", "Output as JSON")
  .option("--output <path>", "Write report to file")
  .action(async (opts) => {
    try {
      const result = await doctorCommand({ profile: opts.profile });
      await writeCliResult(result, opts);
    } catch (error) {
      handleCliError(error);
    }
  });

// smoke command
program
  .command("smoke <target>")
  .description("Run smoke test for a specific target (e.g., gateway)")
  .requiredOption("--profile <name>", "Profile to use (e.g., openclaw)")
  .option("--json", "Output as JSON")
  .option("--output <path>", "Write report to file")
  .action(async (target, opts) => {
    try {
      const result = await smokeCommand(target, { profile: opts.profile });
      await writeCliResult(result, opts);
    } catch (error) {
      handleCliError(error);
    }
  });

program.parse();

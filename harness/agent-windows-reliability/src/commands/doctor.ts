import { runEnvironmentChecks } from "../checks/environment.js";
import { runGatewayChecks } from "../checks/gateway.js";
import { summarizeReport, type HarnessResult } from "../schemas.js";
import type { Report, SectionResult } from "../utils/output.js";

export interface DoctorOptions {
  profile: string;
  json?: boolean;
  output?: string;
}

export async function doctorCommand(opts: DoctorOptions): Promise<HarnessResult> {
  const startedAt = Date.now();

  const envSection: SectionResult = {
    name: "Environment",
    checks: runEnvironmentChecks(),
  };

  const gatewaySection: SectionResult = {
    name: "Gateway",
    checks: runGatewayChecks(opts.profile),
  };

  const report: Report = {
    title: `${opts.profile} Windows Environment Report`,
    sections: [envSection, gatewaySection],
    startedAt,
    finishedAt: Date.now(),
  };

  const summary = summarizeReport(report);
  const hasFailures = summary.fail > 0;

  return {
    command: "doctor",
    profile: opts.profile,
    ok: !hasFailures,
    exitCode: hasFailures ? 1 : 0,
    summary,
    report,
  };
}

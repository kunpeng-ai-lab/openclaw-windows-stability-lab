import { summarizeReport, type HarnessResult } from "../schemas.js";
import type { Report, SectionResult } from "../utils/output.js";
import { getSmokeTarget, listSmokeTargets } from "../targets/smoke-targets.js";

export interface SmokeOptions {
  profile: string;
  json?: boolean;
  output?: string;
  target?: string;
}

export class UnknownSmokeTargetError extends Error {
  code = "UNKNOWN_SMOKE_TARGET";
  exitCode = 2;

  constructor(target: string) {
    super(`Unknown smoke target: ${target}. Available targets: ${listSmokeTargets().join(", ")}`);
    this.name = "UnknownSmokeTargetError";
  }
}

export async function smokeCommand(target: string, opts: SmokeOptions): Promise<HarnessResult> {
  const startedAt = Date.now();

  const targetDefinition = getSmokeTarget(target);
  if (!targetDefinition) {
    throw new UnknownSmokeTargetError(target);
  }

  const section: SectionResult = {
    name: targetDefinition.sectionName,
    checks: targetDefinition.runChecks(opts.profile),
  };

  const report: Report = {
    title: `${opts.profile} Smoke Test: ${target}`,
    sections: [section],
    startedAt,
    finishedAt: Date.now(),
  };

  const summary = summarizeReport(report);
  const hasFailures = summary.fail > 0;

  return {
    command: "smoke",
    profile: opts.profile,
    target,
    ok: !hasFailures,
    exitCode: hasFailures ? 1 : 0,
    summary,
    report,
  };
}

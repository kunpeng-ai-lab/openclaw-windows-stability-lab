export type CheckStatus = "PASS" | "FAIL" | "SKIP" | "WARN";

export interface CheckResult {
  name: string;
  status: CheckStatus;
  message?: string;
  details?: string;
  durationMs?: number;
}

export interface SectionResult {
  name: string;
  checks: CheckResult[];
}

export interface Report {
  title: string;
  sections: SectionResult[];
  startedAt: number;
  finishedAt: number;
}

export function formatReport(report: Report): string {
  const lines: string[] = [];
  const divider = "=".repeat(report.title.length + 4);

  lines.push(divider);
  lines.push(`  ${report.title}`);
  lines.push(divider);
  lines.push("");

  let totalPass = 0;
  let totalFail = 0;
  let totalSkip = 0;
  let totalWarn = 0;

  for (const section of report.sections) {
    lines.push(section.name);
    lines.push("-".repeat(section.name.length));

    for (const check of section.checks) {
      const tag = `[${check.status}]`;
      const msg = check.message ? `: ${check.message}` : "";
      lines.push(`  ${tag} ${check.name}${msg}`);

      if (check.details) {
        for (const detail of check.details.split("\n")) {
          lines.push(`        ${detail}`);
        }
      }

      switch (check.status) {
        case "PASS": totalPass++; break;
        case "FAIL": totalFail++; break;
        case "SKIP": totalSkip++; break;
        case "WARN": totalWarn++; break;
      }
    }
    lines.push("");
  }

  const durationMs = report.finishedAt - report.startedAt;
  const durationSec = (durationMs / 1000).toFixed(1);

  lines.push("-".repeat(40));
  lines.push(`Summary: ${totalPass} passed, ${totalFail} failed, ${totalWarn} warnings, ${totalSkip} skipped`);
  lines.push(`Duration: ${durationSec}s`);
  lines.push("");

  return lines.join("\n");
}

export function formatReportJson(report: Report): string {
  return JSON.stringify(report, null, 2);
}

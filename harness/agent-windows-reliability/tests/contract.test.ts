import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

import { doctorCommand } from "../src/commands/doctor.js";
import { smokeCommand } from "../src/commands/smoke.js";
import {
  AgentWindowsReliabilitySchemas,
  ArtifactRefSchema,
  CaseSchema,
  CheckResultSchema,
  EvidenceBundleSchema,
  HarnessResultSchema,
  HarnessSummarySchema,
  IssueLinkSchema,
  ReportSchema,
  RedactionMetadataSchema,
  RuntimeProfileSchema,
  SectionResultSchema,
  VersionMatrixSchema,
} from "../src/schemas.js";

test("doctorCommand returns a parseable harness result object", async () => {
  const result = await doctorCommand({ profile: "openclaw" });

  assert.equal(result.command, "doctor");
  assert.equal(result.profile, "openclaw");
  assert.equal(typeof result.ok, "boolean");
  assert.equal(typeof result.exitCode, "number");
  assert.ok(result.report.sections.length >= 1);
  assert.equal(JSON.parse(JSON.stringify(result)).command, "doctor");
});

test("smokeCommand returns a parseable harness result object", async () => {
  const result = await smokeCommand("gateway", { profile: "openclaw" });

  assert.equal(result.command, "smoke");
  assert.equal(result.profile, "openclaw");
  assert.equal(result.target, "gateway");
  assert.equal(typeof result.ok, "boolean");
  assert.equal(typeof result.exitCode, "number");
  assert.ok(result.report.sections.length >= 1);
  assert.equal(JSON.parse(JSON.stringify(result)).target, "gateway");
});

test("smokeCommand supports gateway-lifecycle as target contract scaffolding", async () => {
  const result = await smokeCommand("gateway-lifecycle", { profile: "openclaw" });

  assert.equal(result.command, "smoke");
  assert.equal(result.profile, "openclaw");
  assert.equal(result.target, "gateway-lifecycle");
  assert.equal(result.report.title, "openclaw Smoke Test: gateway-lifecycle");
  assert.equal(result.report.sections[0]?.name, "Gateway Lifecycle Target Contract Scaffolding");
  assert.ok(result.report.sections[0]?.checks.length);
});

test("smokeCommand supports agent-responsiveness as a registered target", async () => {
  const result = await smokeCommand("agent-responsiveness", { profile: "openclaw" });

  assert.equal(result.command, "smoke");
  assert.equal(result.profile, "openclaw");
  assert.equal(result.target, "agent-responsiveness");
  assert.equal(result.report.title, "openclaw Smoke Test: agent-responsiveness");
  assert.equal(result.report.sections[0]?.name, "Agent Responsiveness");
  assert.ok(result.report.sections[0]?.checks.length >= 3);
});

test("smokeCommand supports process-tree as a registered target", async () => {
  const result = await smokeCommand("process-tree", { profile: "openclaw" });

  assert.equal(result.command, "smoke");
  assert.equal(result.profile, "openclaw");
  assert.equal(result.target, "process-tree");
  assert.equal(result.report.title, "openclaw Smoke Test: process-tree");
  assert.equal(result.report.sections[0]?.name, "Process Tree");
  assert.ok(result.report.sections[0]?.checks.length >= 3);
});

test("smokeCommand rejects unknown targets without exiting the process", async () => {
  await assert.rejects(
    () => smokeCommand("missing-target", { profile: "openclaw" }),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.equal((error as { code?: string }).code, "UNKNOWN_SMOKE_TARGET");
      assert.equal((error as { exitCode?: number }).exitCode, 2);
      return true;
    },
  );
});

test("schema exports are available for GA imports", () => {
  assert.equal(RedactionMetadataSchema.title, "RedactionMetadata");
  assert.equal(ArtifactRefSchema.title, "ArtifactRef");
  assert.equal(IssueLinkSchema.title, "IssueLink");
  assert.equal(CheckResultSchema.title, "CheckResult");
  assert.equal(SectionResultSchema.title, "SectionResult");
  assert.equal(ReportSchema.title, "Report");
  assert.equal(HarnessSummarySchema.title, "HarnessSummary");
  assert.equal(CaseSchema.title, "CaseSchema");
  assert.equal(HarnessResultSchema.title, "HarnessResult");
  assert.equal(EvidenceBundleSchema.title, "EvidenceBundle");
  assert.equal(RuntimeProfileSchema.title, "RuntimeProfile");
  assert.equal(VersionMatrixSchema.title, "VersionMatrix");

  assert.ok(RedactionMetadataSchema.required.includes("checked"));
  assert.ok(ArtifactRefSchema.required.includes("artifactId"));
  assert.ok(IssueLinkSchema.required.includes("url"));
  assert.ok(CheckResultSchema.required.includes("status"));
  assert.ok(SectionResultSchema.required.includes("checks"));
  assert.ok(ReportSchema.required.includes("sections"));
  assert.ok(HarnessSummarySchema.required.includes("pass"));
  assert.ok(CaseSchema.required.includes("caseId"));
  assert.ok(HarnessResultSchema.required.includes("ok"));
  assert.ok(EvidenceBundleSchema.required.includes("artifacts"));
  assert.ok(RuntimeProfileSchema.required.includes("profileId"));
  assert.ok(VersionMatrixSchema.required.includes("entries"));
});

test("schema map is JSON serializable and includes all shared contracts", () => {
  const serialized = JSON.parse(JSON.stringify(AgentWindowsReliabilitySchemas));

  assert.equal(serialized.RedactionMetadataSchema.title, "RedactionMetadata");
  assert.equal(serialized.ArtifactRefSchema.title, "ArtifactRef");
  assert.equal(serialized.IssueLinkSchema.title, "IssueLink");
  assert.equal(serialized.CheckResultSchema.title, "CheckResult");
  assert.equal(serialized.SectionResultSchema.title, "SectionResult");
  assert.equal(serialized.ReportSchema.title, "Report");
  assert.equal(serialized.HarnessSummarySchema.title, "HarnessSummary");
  assert.equal(serialized.CaseSchema.title, "CaseSchema");
  assert.equal(serialized.HarnessResultSchema.title, "HarnessResult");
  assert.equal(serialized.EvidenceBundleSchema.title, "EvidenceBundle");
  assert.equal(serialized.RuntimeProfileSchema.title, "RuntimeProfile");
  assert.equal(serialized.VersionMatrixSchema.title, "VersionMatrix");
});

test("CLI --json emits a parseable harness result", () => {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "src/cli.ts", "smoke", "gateway", "--profile", "openclaw", "--json"],
    { encoding: "utf8", windowsHide: true },
  );

  assert.notEqual(result.stdout.trim(), "");
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.command, "smoke");
  assert.equal(parsed.profile, "openclaw");
  assert.equal(parsed.target, "gateway");
  assert.equal(typeof parsed.ok, "boolean");
  assert.equal(typeof parsed.exitCode, "number");
  assert.equal(result.status, parsed.exitCode);
});

test("CLI --json emits parseable gateway-lifecycle target contract result", () => {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "src/cli.ts", "smoke", "gateway-lifecycle", "--profile", "openclaw", "--json"],
    { encoding: "utf8", windowsHide: true },
  );

  assert.notEqual(result.stdout.trim(), "");
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.command, "smoke");
  assert.equal(parsed.profile, "openclaw");
  assert.equal(parsed.target, "gateway-lifecycle");
  assert.equal(parsed.report.sections[0]?.name, "Gateway Lifecycle Target Contract Scaffolding");
  assert.equal(typeof parsed.ok, "boolean");
  assert.equal(typeof parsed.exitCode, "number");
  assert.equal(result.status, parsed.exitCode);
});

test("CLI --json emits parseable agent-responsiveness result", () => {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "src/cli.ts", "smoke", "agent-responsiveness", "--profile", "openclaw", "--json"],
    { encoding: "utf8", windowsHide: true },
  );

  assert.notEqual(result.stdout.trim(), "");
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.command, "smoke");
  assert.equal(parsed.profile, "openclaw");
  assert.equal(parsed.target, "agent-responsiveness");
  assert.equal(parsed.report.sections[0]?.name, "Agent Responsiveness");
  assert.equal(typeof parsed.ok, "boolean");
  assert.equal(typeof parsed.exitCode, "number");
  assert.equal(result.status, parsed.exitCode);
});

test("CLI --json emits parseable process-tree result", () => {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "src/cli.ts", "smoke", "process-tree", "--profile", "openclaw", "--json"],
    { encoding: "utf8", windowsHide: true },
  );

  assert.notEqual(result.stdout.trim(), "");
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.command, "smoke");
  assert.equal(parsed.profile, "openclaw");
  assert.equal(parsed.target, "process-tree");
  assert.equal(parsed.report.sections[0]?.name, "Process Tree");
  assert.equal(typeof parsed.ok, "boolean");
  assert.equal(typeof parsed.exitCode, "number");
  assert.equal(result.status, parsed.exitCode);
});

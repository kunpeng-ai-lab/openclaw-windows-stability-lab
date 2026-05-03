import type { CheckResult, CheckStatus, Report, SectionResult } from "./utils/output.js";

export type EvidenceVisibility = "internal" | "customer_visible" | "public" | "restricted";

export interface RedactionMetadata {
  checked: boolean;
  redacted: boolean;
  sensitiveTypes: string[];
  notes?: string;
}

export interface ArtifactRef {
  artifactId: string;
  displayPath: string;
  visibility: EvidenceVisibility;
  mimeType?: string;
  sha256?: string;
}

export interface IssueLink {
  provider: "github" | "other";
  url: string;
  id?: string;
}

export interface CaseSchema {
  caseId: string;
  title: string;
  runtime: string;
  platform: "windows" | "macos" | "linux" | "unknown";
  status: "draft" | "verified" | "upstreamed" | "archived";
  symptoms: string[];
  evidence: ArtifactRef[];
  redaction: RedactionMetadata;
  issueLinks?: IssueLink[];
  createdAt: string;
  updatedAt: string;
}

export interface HarnessSummary {
  pass: number;
  fail: number;
  warn: number;
  skip: number;
}

export interface EvidenceBundle {
  artifacts: ArtifactRef[];
  steps: unknown[];
}

export interface RuntimeProfile {
  profileId: string;
  runtime: string;
  platform: "windows" | "macos" | "linux" | "unknown";
  displayName?: string;
  supportedTargets: string[];
}

export interface VersionMatrixEntry {
  runtime: string;
  version: string;
  platform: "windows" | "macos" | "linux" | "unknown";
  status: "supported" | "warning" | "blocked" | "unknown";
  notes?: string;
}

export interface VersionMatrix {
  matrixId: string;
  generatedAt: string;
  entries: VersionMatrixEntry[];
}

export interface HarnessResult {
  command: "doctor" | "smoke";
  profile: string;
  target?: string;
  ok: boolean;
  exitCode: number;
  summary: HarnessSummary;
  report: Report;
}

export const RedactionMetadataSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "RedactionMetadata",
  type: "object",
  required: ["checked", "redacted", "sensitiveTypes"],
  properties: {
    checked: { type: "boolean" },
    redacted: { type: "boolean" },
    sensitiveTypes: { type: "array", items: { type: "string" } },
    notes: { type: "string" },
  },
  additionalProperties: false,
} as const;

export const ArtifactRefSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "ArtifactRef",
  type: "object",
  required: ["artifactId", "displayPath", "visibility"],
  properties: {
    artifactId: { type: "string" },
    displayPath: { type: "string" },
    visibility: {
      type: "string",
      enum: ["internal", "customer_visible", "public", "restricted"],
    },
    mimeType: { type: "string" },
    sha256: { type: "string" },
  },
  additionalProperties: false,
} as const;

export const IssueLinkSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "IssueLink",
  type: "object",
  required: ["provider", "url"],
  properties: {
    provider: { type: "string", enum: ["github", "other"] },
    url: { type: "string" },
    id: { type: "string" },
  },
  additionalProperties: false,
} as const;

export const CheckResultSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "CheckResult",
  type: "object",
  required: ["name", "status"],
  properties: {
    name: { type: "string" },
    status: { type: "string", enum: ["PASS", "FAIL", "SKIP", "WARN"] },
    message: { type: "string" },
    details: { type: "string" },
    durationMs: { type: "number" },
  },
  additionalProperties: false,
} as const satisfies JsonSchemaFor<CheckResult>;

export const SectionResultSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "SectionResult",
  type: "object",
  required: ["name", "checks"],
  properties: {
    name: { type: "string" },
    checks: { type: "array", items: CheckResultSchema },
  },
  additionalProperties: false,
} as const satisfies JsonSchemaFor<SectionResult>;

export const ReportSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Report",
  type: "object",
  required: ["title", "sections", "startedAt", "finishedAt"],
  properties: {
    title: { type: "string" },
    sections: { type: "array", items: SectionResultSchema },
    startedAt: { type: "number" },
    finishedAt: { type: "number" },
  },
  additionalProperties: false,
} as const satisfies JsonSchemaFor<Report>;

export const HarnessSummarySchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "HarnessSummary",
  type: "object",
  required: ["pass", "fail", "warn", "skip"],
  properties: {
    pass: { type: "number" },
    fail: { type: "number" },
    warn: { type: "number" },
    skip: { type: "number" },
  },
  additionalProperties: false,
} as const satisfies JsonSchemaFor<HarnessSummary>;

export const CaseSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "CaseSchema",
  type: "object",
  required: [
    "caseId",
    "title",
    "runtime",
    "platform",
    "status",
    "symptoms",
    "evidence",
    "redaction",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    caseId: { type: "string" },
    title: { type: "string" },
    runtime: { type: "string" },
    platform: { type: "string", enum: ["windows", "macos", "linux", "unknown"] },
    status: { type: "string", enum: ["draft", "verified", "upstreamed", "archived"] },
    symptoms: { type: "array", items: { type: "string" } },
    evidence: { type: "array", items: ArtifactRefSchema },
    redaction: RedactionMetadataSchema,
    issueLinks: {
      type: "array",
      items: IssueLinkSchema,
    },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
  additionalProperties: false,
} as const;

export const HarnessResultSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "HarnessResult",
  type: "object",
  required: ["command", "profile", "ok", "exitCode", "summary", "report"],
  properties: {
    command: { type: "string", enum: ["doctor", "smoke"] },
    profile: { type: "string" },
    target: { type: "string" },
    ok: { type: "boolean" },
    exitCode: { type: "number" },
    summary: HarnessSummarySchema,
    report: ReportSchema,
  },
  additionalProperties: false,
} as const;

export const EvidenceBundleSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "EvidenceBundle",
  type: "object",
  required: ["artifacts", "steps"],
  properties: {
    artifacts: { type: "array", items: ArtifactRefSchema },
    steps: { type: "array", items: { type: "object" } },
  },
  additionalProperties: false,
} as const satisfies JsonSchemaFor<EvidenceBundle>;

export const RuntimeProfileSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "RuntimeProfile",
  type: "object",
  required: ["profileId", "runtime", "platform", "supportedTargets"],
  properties: {
    profileId: { type: "string" },
    runtime: { type: "string" },
    platform: { type: "string", enum: ["windows", "macos", "linux", "unknown"] },
    displayName: { type: "string" },
    supportedTargets: { type: "array", items: { type: "string" } },
  },
  additionalProperties: false,
} as const satisfies JsonSchemaFor<RuntimeProfile>;

export const VersionMatrixEntrySchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "VersionMatrixEntry",
  type: "object",
  required: ["runtime", "version", "platform", "status"],
  properties: {
    runtime: { type: "string" },
    version: { type: "string" },
    platform: { type: "string", enum: ["windows", "macos", "linux", "unknown"] },
    status: { type: "string", enum: ["supported", "warning", "blocked", "unknown"] },
    notes: { type: "string" },
  },
  additionalProperties: false,
} as const satisfies JsonSchemaFor<VersionMatrixEntry>;

export const VersionMatrixSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "VersionMatrix",
  type: "object",
  required: ["matrixId", "generatedAt", "entries"],
  properties: {
    matrixId: { type: "string" },
    generatedAt: { type: "string" },
    entries: { type: "array", items: VersionMatrixEntrySchema },
  },
  additionalProperties: false,
} as const satisfies JsonSchemaFor<VersionMatrix>;

export const AgentWindowsReliabilitySchemas = {
  RedactionMetadataSchema,
  ArtifactRefSchema,
  IssueLinkSchema,
  CheckResultSchema,
  SectionResultSchema,
  ReportSchema,
  HarnessSummarySchema,
  CaseSchema,
  HarnessResultSchema,
  EvidenceBundleSchema,
  RuntimeProfileSchema,
  VersionMatrixEntrySchema,
  VersionMatrixSchema,
} as const;

export function summarizeReport(report: Report): HarnessSummary {
  const summary: HarnessSummary = { pass: 0, fail: 0, warn: 0, skip: 0 };

  for (const section of report.sections) {
    for (const check of section.checks) {
      const status = check.status.toLowerCase() as Lowercase<CheckStatus>;
      summary[status] += 1;
    }
  }

  return summary;
}

type JsonSchemaFor<T> = Record<string, unknown> & { title: string };

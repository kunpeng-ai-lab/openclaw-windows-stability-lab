import { runAgentResponsivenessChecks } from "../checks/agent-responsiveness.js";
import { runGatewayChecks } from "../checks/gateway.js";
import { runProcessTreeChecks } from "../checks/process-tree.js";
import type { CheckResult } from "../utils/output.js";

export interface SmokeTargetDefinition {
  target: string;
  sectionName: string;
  runChecks: (profile: string) => CheckResult[];
}

export const SMOKE_TARGETS: Record<string, SmokeTargetDefinition> = {
  gateway: {
    target: "gateway",
    sectionName: "Gateway Smoke Test",
    runChecks: runGatewayChecks,
  },
  "gateway-lifecycle": {
    target: "gateway-lifecycle",
    sectionName: "Gateway Lifecycle Target Contract Scaffolding",
    runChecks: runGatewayChecks,
  },
  "agent-responsiveness": {
    target: "agent-responsiveness",
    sectionName: "Agent Responsiveness",
    runChecks: runAgentResponsivenessChecks,
  },
  "process-tree": {
    target: "process-tree",
    sectionName: "Process Tree",
    runChecks: runProcessTreeChecks,
  },
};

export function listSmokeTargets(): string[] {
  return Object.keys(SMOKE_TARGETS);
}

export function getSmokeTarget(target: string): SmokeTargetDefinition | undefined {
  return SMOKE_TARGETS[target];
}

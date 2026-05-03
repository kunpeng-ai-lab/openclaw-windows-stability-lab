import { spawnSync, type SpawnSyncOptions } from "node:child_process";

export interface ExecResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
}

export function execSync(
  command: string,
  args: string[],
  opts: SpawnSyncOptions & { timeout?: number } = {},
): ExecResult {
  const started = Date.now();
  const result = spawnSync(command, args, {
    encoding: "utf8",
    timeout: 10_000,
    windowsHide: true,
    ...opts,
  });
  const durationMs = Date.now() - started;

  return {
    ok: !result.error && result.status === 0,
    stdout: typeof result.stdout === "string" ? result.stdout : result.stdout?.toString("utf8") ?? "",
    stderr: typeof result.stderr === "string" ? result.stderr : result.stderr?.toString("utf8") ?? "",
    exitCode: result.status,
    durationMs,
  };
}

export function execPowerShell(command: string, timeoutMs = 10_000): ExecResult {
  return execSync("powershell", ["-NoProfile", "-Command", command], { timeout: timeoutMs });
}

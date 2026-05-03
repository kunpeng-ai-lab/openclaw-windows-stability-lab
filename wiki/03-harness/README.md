# 03 Harness

Harness 是可执行验证器，用来把经验变成稳定检查。

第一批计划：

- `gateway-health-check.ps1`
- `openclaw-windows-smoke.ps1`
- `feishu-channel-smoke.ps1`
- `agent-dispatch-smoke.ps1`
- `runtime-deps-check.ps1`
- `proxy-policy-check.ps1`
- `collect-evidence-bundle.ps1`
- `version-matrix-runner.ps1`

完成标准：

- 输出 pass/fail。
- 输出证据路径。
- 输出失败分类。
- 输出下一步建议。
- 可被 skill 调用。


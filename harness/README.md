# Harness

这里保存可执行验证器和 smoke test。

Harness 的职责：

- 收集环境。
- 运行检查。
- 输出证据。
- 给出 pass/fail。
- 给出失败分类。
- 可被 skill 和 CI 调用。

第一版先实现本机 PowerShell harness，再考虑 Windows CI runner。


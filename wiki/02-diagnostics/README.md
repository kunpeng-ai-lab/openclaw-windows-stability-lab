# 02 诊断手册

诊断手册把问题拆成稳定路径，避免 Agent 或人直接猜原因。

第一版诊断域：

- Gateway 诊断。
- Windows service / Scheduled Task 诊断。
- Channel 诊断。
- Agent runner 诊断。
- Plugin runtime 诊断。
- Provider auth / proxy 诊断。
- Version upgrade / rollback 诊断。

诊断原则：

```text
先证明哪里断，再修哪里。
先看 gateway 是否可用，再看 channel 是否收到，再看 dispatch 是否进入，再看 agent runner 是否执行。
```


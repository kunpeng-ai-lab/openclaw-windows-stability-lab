# 上游贡献证据归档规范

更新时间：2026-05-02

这份规范用于 OWSL 后续所有 OpenClaw / Hermes / 其他上游贡献。目标是让每一次贡献都能回答四个问题：

1. 我们解决了什么真实问题？
2. 我们向上游提交了什么？
3. 我们如何验证它不是拍脑袋？
4. 后续做文章、视频、客户材料时，证据在哪里？

## 目录规则

每个上游贡献建立一个独立证据目录：

```text
evidence/<project>-<type>-<number>/
```

示例：

```text
evidence/openclaw-pr-76024/
evidence/openclaw-issue-64187/
evidence/hermes-pr-15846/
```

同时在 `upstream/contributions/` 建立一份中文明细卡：

```text
upstream/contributions/<project>-<type>-<number>.zh-CN.md
```

并在总台账中增加一行：

```text
upstream/CONTRIBUTION_LEDGER.zh-CN.md
```

## 单贡献证据目录必须包含

| 文件 | 是否必需 | 说明 |
| --- | --- | --- |
| `README.md` | 必需 | 证据索引，记录链接、状态、截图、验证命令 |
| `*-conversation-*.png` | 建议 | PR / issue conversation 截图，保留上游状态 |
| `*-checks-*.png` | 建议 | CI / checks 截图 |
| `*-review-*.png` | 建议 | bot review / maintainer review 截图 |
| `*-mergeability-*.png` | 建议 | no-conflict / mergeability 截图 |
| `logs/` | 可选 | 本地命令输出、复现日志、CI 摘要 |
| `patch/` | 可选 | diff、关键文件片段、PR body 草稿 |

## README.md 模板

````markdown
# Evidence: <Project> <PR/Issue> #<number>

Captured at: YYYY-MM-DD HH:mm:ss +08:00

## Links

- PR:
- Issue:
- Related:

## Status

- Current upstream state:
- Review state:
- CI state:
- Conflict state:

## Commit

- Full hash:
- Short hash:
- Commit date:
- Branch:

## Screenshot Evidence

| File | Captures |
| --- | --- |
|  |  |

## Local Verification

Working directory:

```text

```

| Command | Result |
| --- | --- |
|  |  |

## Notes For Reuse

- Public-safe claim:
- Do not claim:
- Best content angle:
````

## 明细卡必须记录的字段

每条 `upstream/contributions/*.zh-CN.md` 至少包含：

- 一句话结论
- PR / issue / related links
- PR 元数据
- 改动范围
- 本地验证命令与结果
- bot review / maintainer review 摘要
- CI 状态
- conflict / mergeability 状态
- 截图证据路径
- 可公开复用的素材点
- 不可夸大的边界
- 状态更新日志

## 证据采集时机

| 时机 | 要采什么 |
| --- | --- |
| PR 创建后 | PR conversation 全页、PR body、linked issue、commit hash |
| bot review 后 | bot review 摘要、labels、required changes |
| CI 完成后 | checks 列表、失败项或成功项、warning annotations |
| rebase / force-push 后 | 新 commit hash、compare 记录、重新验证结果 |
| maintainer review 后 | review 评论、requested changes、approve、discussion |
| merge / close 后 | final state、merge commit、close reason |

## 公开表达边界

可以说：

- “已向上游提交 PR”
- “进入 bot review / maintainer review 阶段”
- “本地通过 targeted tests / lint / changed check”
- “截图保留了当时的 PR 状态和 checks 状态”

不要说：

- PR 未合并时，不说“官方已接纳”
- 只有 bot review 时，不说“maintainer approved”
- 只有 deterministic test 时，不说“已经完整复现所有真实 Windows 环境”
- 只有截图显示部分 checks 时，不说“所有 CI 必然通过”，除非已完整确认

## 命名建议

截图文件名建议带上日期和内容：

```text
pr-76024-conversation-fullpage-2026-05-02.png
pr-76024-checks-2026-05-02.png
pr-76024-clawsweeper-review-2026-05-02.png
pr-76024-no-conflict-2026-05-02.png
```

日志文件名建议带上命令意图：

```text
logs/pr-76024-vitest-memory-atomic-reindex-node22-2026-05-02.txt
logs/pr-76024-lint-extensions-2026-05-02.txt
logs/pr-76024-check-changed-2026-05-02.txt
```

## 维护节奏

- 每次上游状态变化，先更新单贡献明细卡，再更新总台账。
- 每次用于文章或视频，补充“内容复用记录”，避免重复找素材。
- 如果旧判断被上游推翻，不删除旧记录，而是追加“纠偏记录”。

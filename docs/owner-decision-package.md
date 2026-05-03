# Owner Decision Package

Date: 2026-05-01

This document presents the combined recommendations from Claude Code and Codex for the 5 decisions reserved for the project owner. Both agents have reviewed each other's positions and reached consensus on recommendations.

---

## Decision 1: Skill Naming

### Options

| Option | Name | Description |
|--------|------|-------------|
| A | `agent-windows-reliability` | Generic name, OpenClaw as first profile |
| B | `openclaw-windows-stability` | OpenClaw-specific name |

### Agent Consensus

**Both agents recommend: Option A**

**Reasoning:**
- The lab project remains `openclaw-windows-stability-lab`
- The reusable skill/tool should be broader: `agent-windows-reliability`
- OpenClaw becomes the first profile: `profiles/openclaw`
- Future profiles possible: `profiles/hermes`, `profiles/claude-code`, etc.

**Structure:**
```
agent-windows-reliability/
  profiles/
    openclaw/      # First serious profile
    hermes/        # Future
    claude-code/   # Future
  harness/
  schemas/
  docs/
```

### Owner Decision Required

- [ ] Approve `agent-windows-reliability` as skill/tool name
- [ ] Approve `profiles/openclaw` as first profile structure
- [ ] Or choose alternative: _________________

---

## Decision 2: Upstream Relationship Posture

### Options

| Option | Posture | Description |
|--------|---------|-------------|
| A | Quiet contributions | Small verified PRs first, build reputation |
| B | Active working group | Propose Windows stability working group soon |

### Agent Consensus

**Both agents recommend: Option A**

**Reasoning:**
- Avoid looking like we're asking for status before proving value
- Build contribution evidence first (3-5 accepted/reviewed artifacts)
- Let the quality of work speak for itself
- Revisit working group proposal after establishing credibility

**Timeline:**
1. **Now - 3 months**: Quiet, evidence-first contributions
2. **3-6 months**: After 3-5 strong artifacts, consider proposing checklist/stewardship
3. **6+ months**: If maintainers receptive, consider formal working group

### Owner Decision Required

- [ ] Approve quiet contribution posture
- [ ] Approve 3-5 artifact threshold for revisiting
- [ ] Or choose alternative: _________________

---

## Decision 3: Open-Source Boundary

### What Becomes Public (Open-Source)

| Category | Items |
|----------|-------|
| **Schemas** | Case schema, version matrix schema, issue template schema |
| **Harness Core** | Smoke test framework, diagnostic commands, evidence collector |
| **Profiles** | OpenClaw profile, Hermes profile (future) |
| **Templates** | Issue templates, PR templates, case templates |
| **Sample Cases** | Redacted case examples (no secrets) |
| **Documentation** | Public wiki, diagnostic guides, contribution guides |

### What Stays Private/Commercial

| Category | Items |
|----------|-------|
| **Customer Reports** | Custom diagnosis reports for specific environments |
| **Managed Service** | Hands-on diagnosis and repair for teams |
| **Private Automation** | Customer-specific environment automation |
| **GEO Scoring** | Proprietary GEO Agent scoring and reporting logic |
| **Credential Automation** | Account/platform credentials management |
| **Enterprise Harness** | Custom harness for enterprise deployments |

### Agent Consensus

**Both agents recommend this boundary**

**Reasoning:**
- Open-source builds credibility and community
- Private services generate revenue
- GEO platform module is strategically important long-term
- Clear separation prevents confusion

### Owner Decision Required

- [ ] Approve open-source items list
- [ ] Approve private/commercial items list
- [ ] Or adjust boundary: _________________

---

## Decision 4: Public Narrative

### Public Narrative (External)

**Theme:** "AI Agent engineering reliability on Windows"

**Key Messages:**
- "Community contribution notes and reproducible diagnostics"
- "Upstream evidence and practical solutions"
- "Windows reliability for AI Agent runtimes"

**Content Types:**
- Blog posts: Problem -> Reproduction -> Fix -> Verification
- Forum posts: Quick tips and workarounds
- GitHub: Issues, PRs, and review comments
- Version matrix: Structured compatibility data

### Internal Narrative (Private)

**Theme:** "GEO Agent reliability training ground"

**Key Capabilities:**
- Diagnosis capability (log parsing, classification)
- Evidence collection (redacted bundles)
- SOP execution (smoke tests, safe repairs)
- Asset archiving (cases, wiki, indexes)
- Source authority building (GitHub, blog, forum)

### Agent Consensus

**Both agents recommend this dual narrative**

**Reasoning:**
- Public: Focus on practical value, not criticism
- Internal: Map to GEO Agent capabilities
- Avoid "complaint record" framing
- Use "community contribution record" framing

### Writing Rules

1. Never write "the official project is bad at Windows"
2. Write what we reproduced, submitted, verified, and what changed
3. Every claim points to evidence (issue, PR, logs, versions)
4. When upstream fixes, update article and acknowledge progress
5. Frame as "community contribution record", not "complaint record"

### Owner Decision Required

- [ ] Approve public narrative theme and messages
- [ ] Approve internal narrative focus
- [ ] Approve writing rules
- [ ] Or adjust narrative: _________________

---

## Decision 5: Commercial Packaging

### Recommended Progression

**Phase 1: Open-Source Credibility (Now - 6 months)**
- Publish open-source diagnostic tool
- Build public case library and wiki
- Establish GitHub contribution record
- Publish blog/forum content

**Phase 2: Paid Service (6-12 months)**
- Offer paid diagnosis for Windows Agent teams
- Custom environment assessment
- Managed repair and verification
- Team training and consultation

**Phase 3: GEO Platform Module (12+ months)**
- Package reliability module for GEO platform
- Automated diagnosis and repair
- Integration with GEO workflows
- Enterprise licensing

### Revenue Model

| Offering | Pricing Model | Target |
|----------|---------------|--------|
| Open-source tool | Free | Community, individual developers |
| Diagnosis service | Per-engagement or retainer | Teams using Windows Agent stacks |
| Managed service | Monthly subscription | Enterprise deployments |
| GEO module | Platform licensing | GEO platform customers |

### Agent Consensus

**Both agents recommend this phased approach**

**Reasoning:**
- Start with credibility, not sales
- Prove value through open-source contributions
- Build paid services on proven expertise
- Integrate into GEO platform when mature

### Owner Decision Required

- [ ] Approve phased progression
- [ ] Approve revenue model
- [ ] Decide Phase 2 timeline: _________________
- [ ] Or adjust strategy: _________________

---

## Summary: All Decisions

| Decision | Recommendation | Owner Decision |
|----------|---------------|----------------|
| 1. Skill naming | `agent-windows-reliability` with `profiles/openclaw` | [x] Approved (Option A) |
| 2. Upstream posture | Quiet contributions, 3-5 artifact threshold | [x] Approved (Option A) |
| 3. Open-source boundary | Schemas/harness/profiles public; services private | [x] Approved |
| 4. Public narrative | "AI Agent reliability on Windows" / "GEO training ground" | [x] Approved |
| 5. Commercial packaging | Credibility -> Service -> GEO module | [x] Approved |

**Owner decision date:** 2026-05-02

---

## Implementation Constraint: `agent-win fix` v1 Boundary

**Rule:** In v1, `agent-win fix` should only apply safe local configuration/process fixes. It should NOT patch installed OpenClaw package source files by default.

**Why:**
- Protects users from version drift and orphaned patches
- Protects our upstream contribution posture (code fixes should be PRs, not monkey patches)
- Avoids creating a maintenance burden for local workarounds

**What `agent-win fix` CAN do in v1:**
- Apply configuration changes (e.g., fix temp dir config, adjust proxy settings)
- Restart/stop/start services and processes
- Clean up stale processes or listeners
- Apply environment variable fixes

**What `agent-win fix` SHOULD NOT do in v1:**
- Patch files inside `node_modules/openclaw/`
- Modify installed OpenClaw source code
- Apply code-level fixes locally

**Exception:** If user explicitly chooses an emergency workaround with `--force`, the tool may apply a local patch, but must:
- Warn that this creates drift from upstream
- Record the patch in a manifest for later cleanup
- Recommend submitting the fix as an upstream PR

---

## Next Steps (Approved 2026-05-02)

**Status: All decisions approved. Ready to execute.**

### Parallel Track A: Harness Track
- Build `agent-win doctor --profile openclaw` locally
- Build `agent-win smoke gateway --profile openclaw` locally
- Focus on evidence collection and redaction before automatic fixes

### Parallel Track B: Upstream Track
1. Review/validate existing PRs: #73533, #75343
2. Run 1-2 hour investigation spike on #64187 (sqlite EBUSY)
3. **Spike outcome**:
   - If fix remains local and testable: proceed to PR
   - If it expands into memory architecture: downgrade to harness/research, pick #71717 or #62099 instead

### Timeline
- Start: Within 1 week of approval (by 2026-05-09)
- First milestone: Harness MVP + investigation spike complete

---

## Appendix: Key Documents

- `docs/framework.md` - Original framework document
- `docs/discussion-2026-05-01-priority-upstream-geo-strategy.md` - Codex initial proposal
- `docs/section-6-evidence-supplement.md` - Claude Code original Section 6
- `docs/codex-response-2026-05-01-section-6-review.md` - Codex feedback
- `docs/section-6-revised.md` - Revised Section 6 (this session)

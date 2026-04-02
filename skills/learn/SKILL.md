---
name: learn
description: Extracts a reusable skill pattern from the current session and saves it to user scope for automatic activation in future sessions.
triggers:
  - "remember this pattern"
  - "save this solution"
  - "extract this as a skill"
  - "learn from this"
  - "save this approach"
  - "make this reusable"
agent: orchestrator
model: haiku
---

## Purpose

Identifies a reusable workflow or solution pattern from the current session and saves it as a skill file to `~/.claude/skills/<pattern-name>.md`. The skill auto-activates in future sessions when its triggers are matched.

## Workflow

1. Orchestrator (haiku) identifies the reusable pattern from the conversation
2. Orchestrator determines a kebab-case name and natural language triggers
3. Orchestrator writes `~/.claude/skills/<pattern-name>.md` directly (the ONE exception where orchestrator writes a file)
4. Orchestrator confirms the skill was saved and shows its triggers

Skill file format written:
```yaml
---
name: <skill-name>
description: <one-line description>
triggers:
  - "<trigger phrase>"
  - "<trigger phrase>"
---

## Workflow
[step-by-step workflow extracted from session]
```

## Usage

```
"remember this pattern for deploying Uniswap V3 liquidity"
"save this debugging approach for reentrancy issues"
"extract this TDD pattern for ERC4626 vaults as a skill"
"make this deployment workflow reusable"

# Output:
~/.claude/skills/<pattern-name>.md — auto-activates in future sessions
```

## Configuration

- Saved to user scope (`~/.claude/skills/`) — available across all projects
- If a skill with the same name already exists, orchestrator asks before overwriting

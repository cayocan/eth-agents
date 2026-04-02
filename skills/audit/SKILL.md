---
name: audit
description: Security vulnerability analysis for Solidity smart contracts. Runs static analysis, optional dynamic testing and formal verification.
triggers:
  - "audit this contract"
  - "audit this"
  - "check for vulnerabilities"
  - "security review"
  - "find bugs in"
  - "analyze security"
  - "is this contract safe"
flags:
  - "--static: auditor only (default, ~2 min)"
  - "--dynamic: + fork tests and fuzz campaigns"
  - "--formal: + formal verification (Certora/Halmos/Echidna)"
  - "--full: all three in sequence"
agent: orchestrator
model: opus
---

## Purpose

Runs a security audit pipeline on smart contracts in the current project. Depth is configurable from fast static analysis to full formal verification.

Default depth is `--static`. User can specify depth in natural language: "do a full audit", "just a quick static check", "run formal verification".

## Workflow

1. Orchestrator calls `eth_skill_start({ skill: "audit", totalPhases: 1 })`
2. Orchestrator spawns `auditor` with the requested depth flag
3. If `--dynamic` or `--full`: auditor spawns → orchestrator spawns `integration-test-engineer` with audit findings as context
4. If `--formal` or `--full`: orchestrator presents tool options to user → spawns `security-specialist`
5. Orchestrator synthesizes all findings into `audit-report.md`
6. Orchestrator calls `eth_reset()`

## Usage

```
# Natural language invocations:
"audit this contract"                    → --static (default)
"do a full security audit"              → --full
"check for reentrancy vulnerabilities"  → --static with focus hint
"run formal verification on the vault"  → --formal

# Output:
audit-report.md — findings sorted by severity with remediation suggestions
```

## Configuration

Depth is detected from user intent:
- "quick", "fast", "basic", "static" → `--static`
- "dynamic", "fuzz", "fork" → `--dynamic`
- "formal", "certora", "halmos", "mathematical" → `--formal`
- "full", "complete", "thorough", "everything" → `--full`
- No depth specified → `--static`

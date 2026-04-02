---
name: full-protocol
description: End-to-end protocol build pipeline — contract development, testing, auditing, gas optimization, deployment, and dApp integration. Hybrid sequential/parallel execution.
triggers:
  - "build the full protocol"
  - "build everything"
  - "start from scratch"
  - "end-to-end"
  - "build the full project"
  - "build it all"
  - "complete implementation"
agent: orchestrator
model: opus
---

## Purpose

The most comprehensive skill. Runs the full hybrid pipeline from contract specification to deployed, frontend-integrated protocol. Uses parallel agent execution where possible.

Phase 3 is conditional: spawns security-specialist only if auditor found Critical/High findings, spawns debugger only if tests failed. If neither condition is met, Phase 3 is skipped entirely.

## Workflow

```
Phase 1 (sequential):
  orchestrator → contract-developer (with TDD loop, unit-test-engineer)

Phase 2 (parallel, up to 3 concurrent):
  auditor (--static) | integration-test-engineer | gas-optimizer

Phase 3 (conditional parallel):
  security-specialist → spawns IF auditor found Critical or High severity findings
  debugger          → spawns IF integration-test-engineer reported failures or invariant violations
  (Phase 3 skipped entirely if neither condition is met)

Phase 4 (parallel):
  deploy-engineer | dapp-developer

Phase 5 (sequential):
  orchestrator synthesizes all outputs → writes protocol-report.md
```

Phase transitions:
- Phase 1→2: contract-developer completes and all unit tests pass
- Phase 2→3: orchestrator evaluates all Phase 2 outputs (audit findings severity + test results)
- Phase 3→4: security-specialist and/or debugger complete (or phase was skipped)
- Phase 4→5: deploy-engineer and dapp-developer both complete

## Usage

```
"build the full DeFi protocol"
"build everything end-to-end"
"start from scratch and build it all"

# Output:
- src/[ContractName].sol (+ all contracts)
- test/ (unit + integration tests)
- audit-report.md
- gas-report.md
- deployments/<chain-id>/<ContractName>.json
- src/hooks/ or src/composables/ (frontend integration)
- protocol-report.md (final synthesis)
```

## Configuration

- Deploy target: orchestrator asks user for target chain before Phase 4
- Audit depth: --static in Phase 2 (security-specialist adds depth in Phase 3 if triggered)
- All agents respect CLAUDE.md Block 7 fallback behavior (tool not found = degrade gracefully)

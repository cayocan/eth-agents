---
name: build-contract
description: Full contract build pipeline — write → TDD loop → static audit → gas optimization. Produces a production-ready contract.
triggers:
  - "build a contract"
  - "create a contract"
  - "implement a smart contract"
  - "write a smart contract"
  - "build me a"
  - "create me a"
agent: orchestrator
model: sonnet
---

## Purpose

End-to-end pipeline for building a single smart contract from specification to production-ready code. Includes TDD loop, static security audit, and gas optimization.

## Workflow

1. Orchestrator calls `eth_skill_start({ skill: "build-contract", totalPhases: 1 })`
2. Orchestrator spawns `contract-developer` with the specification
3. [TDD loop]: unit-test-engineer writes tests → contract-developer implements → repeat until green (max 5 iterations)
4. Orchestrator spawns `auditor` (--static)
5. Orchestrator spawns `gas-optimizer` (baseline snapshot)
6. Orchestrator spawns `contract-developer` with gas suggestions
7. Orchestrator spawns `gas-optimizer` to confirm improvement (must show positive diff before continuing)
8. Orchestrator produces build summary
9. Orchestrator calls `eth_reset()`

## Usage

```
"build a staking contract"
"create an ERC20 token with vesting"
"implement a multisig wallet"
"write a simple auction contract"

# Output:
- src/[ContractName].sol
- test/[ContractName].t.sol (or .test.ts)
- audit-summary.md (static findings)
- gas-report.md (before/after gas diff)
```

## Configuration

- Static audit always included (no way to skip)
- Gas optimization always included
- If gas-optimizer shows no improvement after one pass, pipeline completes without error (optimizer reports "no significant optimizations found")

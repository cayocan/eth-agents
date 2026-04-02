---
name: gas-optimize
description: Gas optimization pass for existing Solidity contracts. Produces before/after gas diff, must show improvement to complete.
triggers:
  - "optimize gas"
  - "reduce gas costs"
  - "gas report"
  - "too expensive"
  - "gas optimization"
  - "reduce gas usage"
  - "lower transaction costs"
agent: orchestrator
model: sonnet
---

## Purpose

Runs a gas optimization loop on existing contracts. gas-optimizer identifies opportunities, contract-developer applies them, gas-optimizer confirms improvement. The pipeline does not complete until a positive diff is confirmed.

## Workflow

1. Orchestrator calls `eth_skill_start({ skill: "gas-optimize", totalPhases: 1 })`
2. Orchestrator spawns `gas-optimizer` to take a baseline snapshot and identify opportunities
3. Orchestrator spawns `contract-developer` with specific, line-referenced suggestions
4. `contract-developer` applies suggestions and runs tests to confirm no regressions
5. Orchestrator spawns `gas-optimizer` to run `forge snapshot --diff` and confirm improvement
6. If no improvement: orchestrator reports "No significant gas optimizations found" and completes
7. If improvement confirmed: orchestrator writes `gas-report.md` and completes
8. Orchestrator calls `eth_reset()`

## Usage

```
"optimize gas for the Vault contract"
"reduce gas costs in my ERC20"
"run a gas report"
"this transaction is too expensive, optimize it"

# Output:
gas-report.md — before/after table, list of changes applied, total savings %
```

## Configuration

- If `forge snapshot` is unavailable (Hardhat project): use `hardhat-gas-reporter` output
- If no improvement after one pass: report "No significant optimizations found" and complete gracefully (do not loop)

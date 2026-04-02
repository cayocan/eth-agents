---
name: tdd
description: Test-driven development loop for Solidity smart contracts. unit-test-engineer writes failing tests, contract-developer implements, loop until green.
triggers:
  - "write tests first"
  - "tdd"
  - "test-driven"
  - "write unit tests for"
  - "test-first development"
  - "write failing tests"
agent: orchestrator
model: sonnet
---

## Purpose

Implements a strict TDD loop for contract development. Ensures every line of implementation code is covered by a test written before the implementation. Maximum 5 iterations before halting.

## Workflow

1. Orchestrator calls `eth_skill_start({ skill: "tdd", totalPhases: 1 })`
2. Orchestrator spawns `unit-test-engineer` with the contract specification
3. `unit-test-engineer` writes failing tests and runs them to confirm failure
4. Orchestrator spawns `contract-developer` with the failing tests
5. `contract-developer` writes minimal implementation to pass the tests
6. Orchestrator spawns `unit-test-engineer` again to verify tests pass + coverage
7. If tests fail: loop back to step 4 (max 5 iterations)
8. When tests pass: orchestrator reports coverage and hands off
9. Orchestrator calls `eth_reset()`

## Usage

```
"write tests first for an ERC20 vault"
"tdd a staking contract"
"write unit tests for the Auction contract before implementing"

# Output:
- test/[ContractName].t.sol (Foundry) or test/[ContractName].test.ts (Hardhat)
- src/[ContractName].sol with minimal implementation
- Coverage report
```

## Configuration

- Max TDD loop iterations: 5 (orchestrator halts and reports after 5 failed loops)
- Toolchain auto-detected (Foundry/Hardhat)
- Coverage threshold: reported but not enforced (user decides if sufficient)

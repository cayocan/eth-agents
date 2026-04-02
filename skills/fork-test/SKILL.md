---
name: fork-test
description: Mainnet fork testing for smart contracts. Tests against real on-chain state at a pinned block number.
triggers:
  - "test against mainnet"
  - "fork test"
  - "test with real state"
  - "simulate on mainnet"
  - "fork testing"
  - "test on a fork"
  - "mainnet simulation"
agent: orchestrator
model: sonnet
---

## Purpose

Writes and runs fork tests that validate contract behavior against real mainnet state. Always pins a specific block number for reproducibility. Uses debugger if any test fails.

## Workflow

1. Orchestrator calls `eth_skill_start({ skill: "fork-test", totalPhases: 1 })`
2. Orchestrator spawns `integration-test-engineer` with the target chain and contracts to test
3. `integration-test-engineer` selects a fork block, writes fork tests, and runs them
4. If any test fails: orchestrator spawns `debugger` with the failing test + revert data
5. `debugger` provides root cause → orchestrator spawns `integration-test-engineer` to fix
6. Loop until all tests pass (max 3 iterations)
7. Orchestrator calls `eth_reset()`

## Usage

```
"run fork tests against mainnet"
"test the Vault against Aave on a fork"
"simulate the swap on a mainnet fork"

# Output:
- test/fork/[ContractName].fork.t.sol
- trace logs for any failures
- Fork block number and chain documented in test file
```

## Configuration

- Requires `ETH_RPC_URL` (or chain-specific RPC var) in `.env`
- If RPC URL missing: halt with "Missing env var: `ETH_RPC_URL`. Add to `.env`."
- Default chain: Ethereum mainnet. Specify other chains in the request.
- Max debug/fix iterations: 3

---
name: deploy
description: Multichain smart contract deployment with Etherscan verification. Requires explicit user confirmation before mainnet execution.
triggers:
  - "deploy to"
  - "deploy this contract"
  - "ship to"
  - "deploy on"
  - "publish on"
  - "deploy contract"
  - "launch on"
agent: orchestrator
model: sonnet
---

## Purpose

Generates a deployment script for the target chain, presents it to the user for review, then executes it and verifies on Etherscan. Works with Foundry scripts or Hardhat Ignition.

**Mainnet deployments always require explicit user confirmation.** The pipeline halts after generating the script and resumes only after the user types "confirm" or "yes".

## Workflow

1. Orchestrator calls `eth_skill_start({ skill: "deploy", totalPhases: 1 })`
2. Orchestrator spawns `deploy-engineer` with target chain and contract to deploy
3. `deploy-engineer` generates the deployment script and dry-runs it (no broadcast)
4. `deploy-engineer` presents deploy plan + estimated gas cost to user
5. **HALT: orchestrator waits for user confirmation** (mandatory for mainnet, skippable for testnet)
6. After confirmation: `deploy-engineer` executes the deployment and verifies on Etherscan
7. `deploy-engineer` writes `deployments/<chain-id>/<ContractName>.json`
8. Orchestrator spawns `dapp-developer` with the artifact path to update frontend
9. Orchestrator calls `eth_reset()`

## Usage

```
"deploy to Sepolia"
"deploy the Vault contract to Arbitrum"
"ship the Token to Base mainnet"
"deploy on Polygon and update the frontend"

# Output:
- deployments/<chain-id>/<ContractName>.json
- Etherscan verification link
- Updated frontend integration (if dApp project detected)
```

## Configuration

Supported chains (auto-detected from user input):
- ethereum (1), arbitrum (42161), optimism (10), base (8453), polygon (137), avalanche (43114)
- sepolia (11155111), holesky (17000), arbitrum-sepolia (421614), optimism-sepolia (11155420), base-sepolia (84532)

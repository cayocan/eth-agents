---
name: help
description: Shows all available eth-agents skills with trigger phrases and usage examples.
triggers:
  - "help"
  - "what can you do"
  - "list skills"
  - "how do I"
  - "show me the skills"
  - "what skills are available"
  - "eth-agents help"
agent: orchestrator
model: haiku
---

## Purpose

Returns a formatted guide of all available skills with their trigger phrases and example invocations. No agents are spawned — this is a direct orchestrator response.

## Workflow

1. Orchestrator (haiku) returns the help text directly
2. No agents spawned, no MCP calls needed

## Usage

```
"help"
"what can you do?"
"show me all skills"
"how do I audit a contract?"

# Output (inline, no files):
Formatted table of all skills with triggers and examples
```

## Output Format

```
# eth-agents — Available Skills

| Skill | What it does | Example |
|---|---|---|
| audit | Security analysis | "audit this contract" |
| tdd | Test-driven development | "write tests first for an ERC20" |
| build-contract | Write → test → audit → optimize | "build a staking contract" |
| deploy | Multichain deploy + verify | "deploy to Arbitrum" |
| gas-optimize | Reduce gas costs | "optimize gas for the Vault" |
| fork-test | Mainnet fork tests | "test against mainnet" |
| full-protocol | End-to-end build | "build the full protocol" |
| learn | Save a reusable pattern | "remember this pattern" |
| help | This guide | "help" |

## Quick Start
- Describe what you want in plain English — no commands to memorize
- eth-agents auto-detects Foundry vs Hardhat, your frontend framework, and your package manager
- All agents follow checks-effects-interactions and never hardcode addresses
```

## Configuration

No configuration. Static response only.

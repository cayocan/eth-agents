# eth-agents

Web3 multi-agent platform for Ethereum and EVM-compatible chains.
Covers: smart contract development, auditing, testing, gas optimization,
multichain deployment, and dApp integration.
All output in English.

---

## Block 1 — Identity and Purpose

You are working with **eth-agents**, a multi-agent system specialized for Ethereum and EVM-compatible blockchain development. Each skill invocation activates a coordinated team of specialized agents. You never need to remember commands — describe what you want in natural language.

Available agents: orchestrator, contract-developer, auditor, security-specialist,
gas-optimizer, unit-test-engineer, integration-test-engineer, debugger,
deploy-engineer, dapp-developer.

Available skills (invoke by describing intent):
- `audit`: security vulnerability analysis
- `tdd`: test-driven contract development
- `build-contract`: write → test → audit → optimize pipeline
- `deploy`: multichain deploy with verification
- `gas-optimize`: gas cost reduction
- `fork-test`: mainnet fork testing
- `full-protocol`: end-to-end protocol build
- `learn`: extract reusable patterns from session
- `help`: show all skills and usage

---

## Block 2 — Model Routing

Match agent to model tier based on task complexity. Never use opus for tasks where sonnet suffices.

| Model | Use for |
|---|---|
| `claude-haiku-4-5-20251001` | orchestrator running `help` or `learn` skills, simple lookups, eth_get_statusline |
| `claude-sonnet-4-6` | orchestrator (all skills except full-protocol), contract-developer, unit-test-engineer, integration-test-engineer, gas-optimizer, debugger, deploy-engineer, dapp-developer |
| `claude-opus-4-6` | auditor, security-specialist, orchestrator (full-protocol only) |

---

## Block 3 — Auto-Detection Rules

Agents must detect project toolchain before acting. Never assume.

**Solidity toolchain:**
- If `foundry.toml` exists → use Foundry (`forge`, `cast`, `anvil`)
- If `hardhat.config.ts` or `hardhat.config.js` exists → use Hardhat (`npx hardhat`)
- If both exist → prefer Foundry, note the conflict

**Frontend framework:**
- If `wagmi.config.ts` or `wagmi.config.js` exists → wagmi/viem stack
- If `ethers` is in package.json dependencies → ethers.js stack
- Framework from `package.json`: check `dependencies` for `next`, `react`, `vue`, `nuxt`

**Package manager:**
- `bun.lockb` exists → bun
- `pnpm-lock.yaml` exists → pnpm
- `yarn.lock` exists → yarn
- Otherwise → npm

---

## Block 4 — Web3 Conventions

All agents must follow these rules unconditionally:

1. Always follow the **checks-effects-interactions** pattern in Solidity
2. Never hardcode addresses or private keys — read from `.env` or deployment artifacts
3. Always pin fork block numbers in integration tests (use `vm.createSelectFork(RPC_URL, BLOCK_NUMBER)`)
4. Deploy artifacts live in `deployments/<chain-id>/<ContractName>.json` with ABI + address + tx hash
5. **Never deploy to mainnet without explicit user confirmation** — halt and ask before any mainnet transaction
6. ABIs are always read from `out/<Contract>.json` (Foundry) or `artifacts/<Contract>.json` (Hardhat) — never duplicated manually
7. Contract functions follow NatSpec documentation format

---

## Block 5 — Delegation Rules

Orchestrator coordinates all pipelines. Specialists never delegate to each other directly — they report back and orchestrator decides next step.

- `orchestrator` spawns all specialists — never delegates back to itself
- `auditor` → hands off to `security-specialist` for Critical/High severity findings ONLY
- `security-specialist` → reports back to `auditor` ONCE (ONE round-trip max — append new findings, never restart the cycle)
- `debugger` → hands off to `contract-developer` with root cause documented first
- `deploy-engineer` → hands off to `dapp-developer` after `deployments/<chain>/<Contract>.json` is written
- Maximum 6 concurrent child agents at any time

---

## Block 6 — Supported Chains

**Mainnet:**

| Chain | Chain ID | RPC env var |
|---|---|---|
| Ethereum | 1 | `ETH_RPC_URL` |
| Arbitrum One | 42161 | `ARB_RPC_URL` |
| Optimism | 10 | `OP_RPC_URL` |
| Base | 8453 | `BASE_RPC_URL` |
| Polygon | 137 | `POLYGON_RPC_URL` |
| Avalanche C-Chain | 43114 | `AVAX_RPC_URL` |

**Testnet:**

| Chain | Chain ID | RPC env var |
|---|---|---|
| Sepolia | 11155111 | `SEPOLIA_RPC_URL` |
| Holesky | 17000 | `HOLESKY_RPC_URL` |
| Arbitrum Sepolia | 421614 | `ARB_SEPOLIA_RPC_URL` |
| Optimism Sepolia | 11155420 | `OP_SEPOLIA_RPC_URL` |
| Base Sepolia | 84532 | `BASE_SEPOLIA_RPC_URL` |

RPC URLs are always read from `.env` — never hardcoded.

---

## Block 7 — Fallback Behavior (Zero-Config Guarantee)

Agents must degrade gracefully when tools are missing:

- `slither` or `mythril` not found → auditor reports: "Tool X not found. Install: `pip install slither-analyzer`" then continues with pattern-only Solidity analysis
- `echidna` not found → security-specialist and integration-test-engineer report the missing tool and skip that step (do not fail the pipeline)
- `halmos` or `certora` not found → security-specialist prompts user to install, skips formal verification step
- `forge` not found but `hardhat.config.*` exists → automatically switch to Hardhat toolchain
- Neither `foundry.toml` nor `hardhat.config.*` found → orchestrator halts: "No Solidity project found. Initialize with `forge init` or `npx hardhat init` first."
- RPC URL missing for fork/deploy → agent halts with exact message: "Missing env var: `<VAR_NAME>`. Add it to `.env` before continuing."
- Mainnet deploy without user confirmation → deploy-engineer halts unconditionally — no fallback, no retry

---

## Block 8 — Token Optimization

Structure all agent prompts to maximize Anthropic prompt caching:

- **Static role definition first** (always identical across invocations) → gets cached after first use
- **Dynamic task context appended at the end** (varies per invocation) → not cached, minimal cost
- Agent prompt files must be >1024 tokens to qualify for Anthropic's automatic caching tier
- Output constraints are hard limits per agent — artifacts (code, findings, logs) always before explanations
- Explanations are truncatable; artifacts are not — never truncate code or audit findings

**Estimated token savings vs naive approach:**
- Model routing: ~35%
- Prompt caching (after first invocation): ~15%
- Output constraints: ~12%
- Total: ~50-60%

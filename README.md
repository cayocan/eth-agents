<h1 align="center">eth-agents</h1>

<p align="center">
  <strong>Web3 multi-agent platform for Ethereum and EVM-compatible chains — built for Claude Code.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-Plugin-blue?style=flat-square" alt="Claude Code Plugin"/>
  <img src="https://img.shields.io/badge/Solidity-0.8.x-363636?style=flat-square&logo=solidity" alt="Solidity"/>
  <img src="https://img.shields.io/badge/Foundry-compatible-red?style=flat-square" alt="Foundry"/>
  <img src="https://img.shields.io/badge/Hardhat-compatible-yellow?style=flat-square" alt="Hardhat"/>
  <img src="https://img.shields.io/badge/EVM-multichain-purple?style=flat-square" alt="EVM"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License"/>
</p>

<p align="center">
  Smart contract development · Security auditing · Testing · Gas optimization · Multichain deployment · dApp integration
</p>

<p align="center">
  <strong>Zero configuration. Natural language interface. 10 specialized agents. 9 skills.</strong>
</p>

---

## What is eth-agents?

`eth-agents` is a Claude Code plugin that brings a **team of 10 specialized AI agents** to your Ethereum development workflow. Instead of switching between tools and remembering commands, you describe what you want in plain English — eth-agents figures out the rest.

```
You:  "audit this contract for reentrancy vulnerabilities"
      ↓
Orchestrator activates the audit pipeline
      ↓
Auditor scans for reentrancy, flash loans, MEV, access control issues
      ↓
Security Specialist simulates exploits for Critical/High findings
      ↓
audit-report.md written with findings, severity ratings, and fixes
```

Each agent has a **specific role**, **defined tools**, **output constraints**, and **clear handoff rules**. They coordinate automatically — you just describe the outcome you want.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLAUDE CODE                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      ORCHESTRATOR                        │   │
│  │          (entry point for every skill invocation)        │   │
│  └───────────┬──────────────────────────────────┬──────────┘   │
│              │ spawns                            │              │
│     ┌────────▼────────┐               ┌─────────▼──────────┐   │
│     │  DEVELOPMENT    │               │     SECURITY        │   │
│     │                 │               │                     │   │
│     │ contract-dev    │               │ auditor             │   │
│     │ unit-test-eng   │               │ security-specialist │   │
│     │ integ-test-eng  │               └─────────────────────┘   │
│     └────────┬────────┘                                         │
│              │                        ┌─────────────────────┐   │
│     ┌────────▼────────┐               │    OPERATIONAL      │   │
│     │   TESTING       │               │                     │   │
│     │                 │               │ gas-optimizer       │   │
│     │ debugger        │               │ deploy-engineer     │   │
│     └─────────────────┘               │ dapp-developer      │   │
│                                       └─────────────────────┘   │
│                          ┌────────────┐                         │
│                          │  MCP HUD   │  ⟠ [audit] auditor ▶   │
│                          │  SERVER    │  Phase 2/5 · 14k tokens │
│                          └────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Install

**Step 1** — add the marketplace (one-time):

```bash
claude plugin marketplace add github:cayocan/eth-agents
```

**Step 2** — install the plugin:

```bash
claude plugin install eth-agents@eth-agents
```

That's it. No configuration files to create, no env vars to set, no toolchain to specify.

> **Requirements:** Claude Code · Node.js 18+

---

## Quick Start

Just describe what you want in plain English:

```
# Security
"audit this contract"
"do a full security audit with formal verification"
"check for reentrancy and flash loan vulnerabilities"

# Development
"build a staking contract with ERC4626"
"write tests first for the Vault contract"
"implement an ERC20 token with vesting"

# Testing
"run fork tests against mainnet"
"test the swap against Uniswap V3 on a fork"

# Optimization
"optimize gas for the Vault contract"
"reduce deployment costs"

# Deployment
"deploy to Arbitrum Sepolia"
"ship the Token to Base mainnet and update the frontend"

# Full pipeline
"build the full DeFi protocol end-to-end"
```

---

## Skills

Skills are the entry points — they activate coordinated agent pipelines. Invoke them by describing intent.

---

### `audit` — Security Vulnerability Analysis

Runs a systematic security audit. Depth is configurable from fast static analysis to full formal verification.

| Flag                   | What runs                                         | Time     |
| ---------------------- | ------------------------------------------------- | -------- |
| `--static` _(default)_ | Auditor only — pattern analysis + Slither/Mythril | Fast     |
| `--dynamic`            | + Fork tests and Echidna fuzz campaigns           | Medium   |
| `--formal`             | + Certora Prover / Halmos formal verification     | Slow     |
| `--full`               | All three in sequence                             | Thorough |

**Triggers:** "audit this contract" · "check for vulnerabilities" · "security review" · "find bugs in" · "is this contract safe"

**Pipeline:**

```
orchestrator → auditor (--static/dynamic/formal/full)
                     ↓ if --dynamic or --full
             → integration-test-engineer
                     ↓ if Critical/High findings
             → security-specialist
                     ↓
             → audit-report.md
```

**Output:** `audit-report.md` — findings sorted by severity (Critical → High → Medium → Low → Info) with description, impact, and remediation for each.

---

### `tdd` — Test-Driven Development

Enforces a strict TDD loop: tests are written before implementation, implementation must make them pass.

**Triggers:** "write tests first" · "tdd" · "test-driven" · "write unit tests for" · "write failing tests"

**Pipeline:**

```
unit-test-engineer (writes failing tests)
        ↕  loop (max 5 iterations)
contract-developer (implements to pass tests)
        ↓ all green
unit-test-engineer (coverage report)
```

**Output:** test files + implementation contract + coverage report.

---

### `build-contract` — Full Contract Build Pipeline

End-to-end: spec → TDD → static audit → gas optimization. Produces a production-ready contract.

**Triggers:** "build a contract" · "create a" · "implement a smart contract" · "write a smart contract"

**Pipeline:**

```
contract-developer → [tdd loop] → auditor (--static) → gas-optimizer (baseline)
        → contract-developer (applies gas suggestions)
        → gas-optimizer (confirms positive diff)
```

**Output:** `src/[Contract].sol` · test files · `audit-summary.md` · `gas-report.md`

---

### `deploy` — Multichain Deployment

Generates a deployment script, dry-runs it, presents it to you for review, then deploys and verifies on Etherscan.

> ⚠️ **Mainnet deployments always require your explicit confirmation.** The pipeline halts after the dry-run and only resumes after you type "confirm".

**Triggers:** "deploy to" · "ship to" · "deploy contract" · "launch on"

**Pipeline:**

```
deploy-engineer (generates script + dry-run)
        ↓ presents plan + estimated gas cost
[USER CONFIRMATION REQUIRED for mainnet]
        ↓
deploy-engineer (executes + Etherscan verification)
        ↓ writes deployments/<chain-id>/<Contract>.json
dapp-developer (updates frontend with new addresses)
```

**Supported chains:**

| Mainnet           | Testnet                     |
| ----------------- | --------------------------- |
| Ethereum (1)      | Sepolia (11155111)          |
| Arbitrum (42161)  | Holesky (17000)             |
| Optimism (10)     | Arbitrum Sepolia (421614)   |
| Base (8453)       | Optimism Sepolia (11155420) |
| Polygon (137)     | Base Sepolia (84532)        |
| Avalanche (43114) |                             |

---

### `gas-optimize` — Gas Cost Reduction

Identifies gas waste, applies optimizations one category at a time, and must show a positive diff before completing.

**Triggers:** "optimize gas" · "reduce gas costs" · "gas report" · "too expensive" · "lower transaction costs"

**Pipeline:**

```
gas-optimizer (baseline snapshot)
        → contract-developer (applies suggestions)
        → gas-optimizer (forge snapshot --diff — must show improvement)
        → gas-report.md
```

**Output:** `gas-report.md` — before/after table per function + total savings %.

---

### `fork-test` — Mainnet Fork Testing

Tests contracts against real on-chain state at a pinned block number. Uses `debugger` on failures.

**Triggers:** "fork test" · "test against mainnet" · "test with real state" · "simulate on mainnet"

**Pipeline:**

```
integration-test-engineer (writes + runs fork tests)
        ↓ on failure
debugger (root cause analysis)
        ↓ fix
integration-test-engineer (re-runs) — loop max 3 iterations
```

**Output:** `test/fork/[Contract].fork.t.sol` + trace logs.

> Requires `ETH_RPC_URL` (or chain-specific var) in `.env`.

---

### `full-protocol` — End-to-End Protocol Build

The most comprehensive skill. Runs the full hybrid pipeline across all 10 agents with parallel execution where possible.

**Triggers:** "build the full protocol" · "build everything" · "start from scratch" · "end-to-end"

**Pipeline:**

```
Phase 1 (sequential)
  contract-developer + [tdd loop with unit-test-engineer]

Phase 2 (parallel — up to 3 concurrent)
  auditor (--static) | integration-test-engineer | gas-optimizer

Phase 3 (conditional — skipped if not needed)
  security-specialist  →  spawns IF auditor found Critical or High findings
  debugger             →  spawns IF integration tests failed or invariant violated

Phase 4 (parallel)
  deploy-engineer | dapp-developer

Phase 5 (sequential)
  orchestrator synthesizes all outputs → protocol-report.md
```

**Output:** all contracts · all tests · `audit-report.md` · `gas-report.md` · deployment artifacts · frontend hooks · `protocol-report.md`

---

### `learn` — Save Reusable Patterns

Extracts a workflow pattern from the current session and saves it as a skill to your user scope. Auto-activates in future sessions.

**Triggers:** "remember this pattern" · "save this solution" · "extract this as a skill" · "learn from this"

**Output:** `~/.claude/skills/<pattern-name>.md` — available in all future Claude Code sessions.

---

### `help` — Show All Skills

Returns a formatted guide of all available skills. No agents are spawned.

**Triggers:** "help" · "what can you do" · "list skills" · "how do I"

---

## Agents

10 specialized agents coordinate your tasks. Each has a defined role, tools, and output constraints.

---

### Orchestrator

The central coordinator. Entry point for every skill, exit point for every pipeline. Never writes code directly.

- **Model:** haiku (help/learn) · sonnet (most skills) · opus (full-protocol)
- **Tools:** Agent, Read, Glob, Grep
- **Role:** Decides sequential vs parallel phases, spawns specialists, synthesizes results, verifies completion
- **HUD:** Calls `eth_skill_start` on entry, `eth_phase_update` at each phase, `eth_reset` on completion

---

### Contract Developer

Writes Solidity and Vyper smart contracts. Operates in a TDD loop. Prefers audited library implementations (OpenZeppelin, Solmate) over custom code for common patterns.

- **Model:** sonnet
- **Tools:** Read, Write, Edit, Bash (forge/hardhat compile only), Glob, Grep
- **Constraints:**
  - Always follows checks-effects-interactions
  - Inherits from OpenZeppelin for ERC standards — never re-implements from scratch
  - Prefers audited libs (AccessControl, ReentrancyGuard, SafeERC20, MerkleProof, ECDSA...) when security-critical
  - Uses `SafeERC20` for all ERC20 transfers
  - Uses `ReentrancyGuard` on ETH-transferring functions
  - Pins Solidity version (`^0.8.20`, never `>=`)
  - Never hardcodes addresses — constructor params or immutables only
  - Never deploys — that is deploy-engineer's scope
- **Output:** contract file + compile confirmation · max 2000 tokens

---

### Auditor

Read-only security analyst. Detects 12 vulnerability classes and produces structured findings with severity ratings.

- **Model:** opus
- **Tools:** Read, Glob, Grep, Bash (Slither/Mythril — read only)
- **Vulnerability classes covered:**
  - Reentrancy (single/cross-function/cross-contract)
  - Access control (missing modifiers, unprotected initializers)
  - Integer issues (overflow, precision loss, unsafe unchecked)
  - Flash loan attack surface (oracle manipulation, donation attacks)
  - MEV exposure (front-running, sandwich, commit-reveal absence)
  - Logic errors (off-by-one, state machine, wrong decimals)
  - External call risks (unsafe delegatecall, return value not checked)
  - Denial of service (unbounded loops, gas griefing)
  - Signature replay (missing nonce, chain ID, EIP-712 issues)
  - Centralization risks (single points of failure, no timelock)
  - Upgradeability issues (storage collision, missing `_disableInitializers`)
  - Token integration risks (fee-on-transfer, rebasing, ERC-777 callbacks)
  - **Reinvented wheel risks** — custom re-implementations of audited library functionality
- **Constraints:** max 10 findings · max 600 tokens/finding · ONE round-trip with security-specialist
- **Severity scale:** Critical · High · Medium · Low · Info

---

### Security Specialist

Validates Critical/High findings through exploit simulation and formal verification. Works at the depth you choose.

- **Model:** opus
- **Tools:** Read, Write, Bash (Echidna, Halmos, Certora, forge test)
- **Depth modes:**
  - `--static`: no additional work
  - `--dynamic`: Echidna exploit campaigns (`echidna.config.security.yaml`)
  - `--formal`: Halmos bounded model checking or Certora Prover
  - `--full`: all three
- **Constraints:** writes PoC tests (not deployment scripts) · max 800 tokens/scenario · marks unconfirmed findings explicitly · always confirms before running Certora (requires API key)

---

### Unit Test Engineer

Writes isolated unit tests before implementation exists. Mocks every external dependency. Never uses fork state.

- **Model:** sonnet
- **Tools:** Read, Write, Edit, Bash (forge test / hardhat test — no `--fork-url`)
- **Constraints:** every external contract call must be mocked · descriptive test names (`test_Function_Condition_Result`) · always test revert conditions · runs full suite after implementation (regression check)
- **Output:** test files + run results + coverage report · max 1500 tokens

---

### Integration Test Engineer

Writes fork tests, fuzz tests, and invariant tests against real mainnet state.

- **Model:** sonnet
- **Tools:** Read, Write, Edit, Bash (forge fork / Echidna with `echidna.config.test.yaml`)
- **Constraints:** always pins fork block number (never `latest`) · documents all mainnet addresses used · halts if RPC URL missing · invariant tests must define `invariant_` functions
- **Output:** fork test files + trace logs · max 1500 tokens

---

### Gas Optimizer

Reduces gas costs without changing business logic. Must produce a positive diff before handing off.

- **Model:** sonnet
- **Tools:** Read, Edit, Bash (forge snapshot, forge test --gas-report)
- **Techniques:** storage packing · calldata vs memory · loop optimization · custom errors · immutable/constant · short-circuit evaluation · event indexing
- **Constraints:** never changes behavior · applies one category at a time · reverts if no improvement
- **Output:** before/after table per function · max 400 tokens

---

### Debugger

Diagnoses failing transactions and reverting calls. Documents root cause before suggesting any fix.

- **Model:** sonnet
- **Tools:** Read, Grep, Bash (cast run, cast call, forge trace, forge debug, cast decode-error)
- **Constraints:** read-only on production state · root cause statement required before fix suggestion · no workarounds (must address root cause)
- **Output:** root cause + EVM trace + fix location · max 500 tokens

---

### Deploy Engineer

Writes and executes deployment scripts. Handles multichain deployments, dry-runs, and Etherscan verification.

- **Model:** sonnet
- **Tools:** Read, Write, Edit, Bash (forge script, cast, hardhat ignition)
- **Constraints:** **never deploys to mainnet without your explicit confirmation** · always dry-runs first · reads keys from `.env` only (never hardcodes) · verifies on Etherscan before writing artifact
- **Artifact schema:** `deployments/<chain-id>/<Contract>.json` with address, ABI, txHash, blockNumber, chainId, deployedAt
- **Output:** deployment plan + result · max 600 tokens

---

### dApp Developer

Integrates deployed contracts into your frontend. Framework-agnostic — auto-detects your stack.

- **Model:** sonnet
- **Tools:** Read, Write, Edit, Bash (npm/bun/pnpm/yarn + build check), Glob
- **Auto-detects:**
  - Web3 library: wagmi/viem (`wagmi.config.*`) or ethers.js v6
  - Framework: Next.js · React · Vue · Nuxt
  - Package manager: bun · pnpm · yarn · npm
- **Constraints:** always reads addresses/ABIs from deployment artifacts (never copy-paste) · never exposes private keys · handles all 3 transaction states (loading/success/error)
- **Output:** hooks/composables + utility files + build confirmation · max 1500 tokens

---

## Zero Configuration

eth-agents auto-detects your project setup. You never need to configure anything:

| What               | How it's detected                                                             |
| ------------------ | ----------------------------------------------------------------------------- |
| Solidity toolchain | `foundry.toml` → Foundry · `hardhat.config.*` → Hardhat                       |
| Frontend framework | `next` / `react` / `vue` / `nuxt` in `package.json`                           |
| Web3 library       | `wagmi.config.*` → wagmi/viem · `"ethers"` in deps → ethers.js v6             |
| Package manager    | `bun.lockb` → bun · `pnpm-lock.yaml` → pnpm · `yarn.lock` → yarn · else → npm |

**Graceful degradation** — if a tool isn't installed, agents report what's missing and continue with what's available:

| Missing tool       | Behavior                                                                  |
| ------------------ | ------------------------------------------------------------------------- |
| Slither / Mythril  | Auditor continues with manual pattern analysis                            |
| Echidna            | Security Specialist / Integration Test Engineer skips that step           |
| Halmos / Certora   | Security Specialist prompts to install, skips formal verification         |
| No toolchain found | Orchestrator halts and asks you to run `forge init` or `npx hardhat init` |
| RPC URL missing    | Agent halts with the exact env var name you need to add                   |

---

## Token Optimization

eth-agents is designed to minimize token usage without sacrificing quality.

| Layer              | Mechanism                                                                                 | Savings     |
| ------------------ | ----------------------------------------------------------------------------------------- | ----------- |
| Model routing      | haiku for simple tasks, sonnet for implementation, opus only for security + full-protocol | ~35%        |
| Prompt caching     | Static agent role definitions are cached after first invocation                           | ~15%        |
| Output constraints | Per-agent token limits, artifacts always before prose                                     | ~12%        |
| **Total**          |                                                                                           | **~50-60%** |

Prompt caching works because each agent file is >1024 tokens (Anthropic's automatic caching threshold) and the static role definition is always at the top — identical across invocations and therefore cached.

---

## MCP HUD Server

eth-agents includes a minimal MCP server that feeds real-time status to the Claude Code status bar:

```
⟠ [full-protocol] Phase 2/5 | auditor · tests · gas ▶ | 14k tokens · 67% cached
⟠ [audit --full] security-specialist ▶ | 8k tokens
⟠ idle
```

The HUD exposes 6 tools used internally by agents:

- `eth_skill_start` — called by orchestrator at pipeline entry
- `eth_phase_update` — called at each phase transition
- `eth_agent_update` — called by each agent on start and completion
- `eth_token_update` — self-reported approximate token usage
- `eth_get_statusline` — polled by Claude Code statusline
- `eth_reset` — called by orchestrator at pipeline end

---

## Project Structure

```
eth-agents/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── agents/
│   ├── orchestrator.md      # Pipeline coordinator
│   ├── contract-developer.md
│   ├── auditor.md
│   ├── security-specialist.md
│   ├── gas-optimizer.md
│   ├── unit-test-engineer.md
│   ├── integration-test-engineer.md
│   ├── debugger.md
│   ├── deploy-engineer.md
│   └── dapp-developer.md
├── skills/
│   ├── audit/SKILL.md
│   ├── tdd/SKILL.md
│   ├── build-contract/SKILL.md
│   ├── deploy/SKILL.md
│   ├── gas-optimize/SKILL.md
│   ├── fork-test/SKILL.md
│   ├── full-protocol/SKILL.md
│   ├── learn/SKILL.md
│   └── help/SKILL.md
├── mcp/
│   ├── hud-server.ts        # HUDServer class (pure state, testable)
│   ├── server.ts            # MCP protocol wiring
│   └── hud-server.cjs       # Bundled output (Node.js runtime)
├── scripts/
│   ├── bundle-mcp.mjs       # esbuild bundler
│   └── validate.mjs         # Structural validation
├── tests/
│   └── mcp/
│       └── hud-server.test.ts  # 18 vitest unit tests
├── CLAUDE.md                # 8-block system context for Claude Code
├── .mcp.json                # MCP server registration
├── package.json
└── tsconfig.json
```

---

## Development

```bash
# Install dependencies
npm install

# Run tests (18 unit tests for the MCP HUD server)
npm test

# Build MCP bundle
npm run build

# Validate all agent and skill files
node scripts/validate.mjs
```

---

## License

MIT — see [LICENSE](LICENSE)

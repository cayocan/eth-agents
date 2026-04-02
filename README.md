# eth-agents

> Web3 multi-agent platform for Ethereum and EVM-compatible chains — built for Claude Code.

Smart contract development, security auditing, testing, gas optimization, multichain deployment, and dApp integration. Zero configuration. Natural language interface.

## Install

```bash
claude plugin install eth-agents
```

## Quick Start

Just describe what you want:

```
"audit this contract"
"build a staking contract"
"deploy to Arbitrum"
"run fork tests against mainnet"
"build the full protocol end-to-end"
```

## Skills

| Skill | What it does |
|---|---|
| `audit` | Security analysis — static, dynamic, or formal verification |
| `tdd` | Test-driven development loop |
| `build-contract` | Write → test → audit → optimize pipeline |
| `deploy` | Multichain deploy with Etherscan verification |
| `gas-optimize` | Gas reduction with before/after diff |
| `fork-test` | Mainnet fork testing |
| `full-protocol` | End-to-end build: contracts + tests + audit + deploy + dApp |
| `learn` | Save reusable patterns from session |
| `help` | Show all skills |

## Agents

10 specialized agents coordinate to complete your tasks:

- **orchestrator** — hybrid pipeline coordinator
- **contract-developer** — Solidity/Vyper, ERC standards, auto-detects Foundry/Hardhat
- **auditor** — reentrancy, access control, flash loans, MEV, oracle manipulation
- **security-specialist** — exploit simulation, formal verification (Certora/Halmos/Echidna)
- **unit-test-engineer** — isolated unit tests, mocking, TDD loop
- **integration-test-engineer** — fork tests, fuzz/invariant tests
- **gas-optimizer** — storage packing, calldata optimization, EIP patterns
- **debugger** — transaction traces, revert decoding, EVM stack analysis
- **deploy-engineer** — multichain deployment scripts, Etherscan verification
- **dapp-developer** — framework-agnostic frontend integration (ethers.js / wagmi/viem)

## Supported Chains

Ethereum, Arbitrum, Optimism, Base, Polygon, Avalanche — plus all major testnets.

## Zero Configuration

Auto-detects:
- **Toolchain**: Foundry (`foundry.toml`) or Hardhat (`hardhat.config.*`)
- **Frontend**: React, Next.js, Vue, Nuxt
- **Web3 library**: wagmi/viem or ethers.js
- **Package manager**: bun, pnpm, yarn, or npm

## Token Optimization

~50-60% token savings vs naive approach:
- Model routing: haiku/sonnet/opus by task complexity (~35%)
- Prompt caching: static agent definitions cached after first invocation (~15%)
- Output constraints: artifacts before prose, per-agent token limits (~12%)

## Requirements

- Claude Code
- Node.js 18+
- Foundry or Hardhat (auto-detected)

## License

MIT

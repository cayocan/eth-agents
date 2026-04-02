// scripts/validate.mjs
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
let errors = 0

function fail(msg) { console.error(`  ✗ ${msg}`); errors++ }
function pass(msg) { console.log(`  ✓ ${msg}`) }

// --- Agents ---
const AGENT_SECTIONS = ['## Mission', '## Tools', '## Constraints', '## Handoff', '## Output Format', '## HUD Protocol']
const AGENTS = [
  'orchestrator', 'contract-developer', 'auditor', 'security-specialist',
  'gas-optimizer', 'unit-test-engineer', 'integration-test-engineer',
  'debugger', 'deploy-engineer', 'dapp-developer'
]

console.log('\n=== Agents ===')
for (const agent of AGENTS) {
  const path = join(root, 'agents', `${agent}.md`)
  if (!existsSync(path)) { fail(`agents/${agent}.md — file missing`); continue }
  const content = readFileSync(path, 'utf8')
  const tokenEstimate = Math.round(content.length / 4)
  if (tokenEstimate < 1024) fail(`agents/${agent}.md — too short for prompt caching (${tokenEstimate} tokens, need >1024)`)
  else pass(`agents/${agent}.md — ${tokenEstimate} tokens (cacheable)`)
  for (const section of AGENT_SECTIONS) {
    if (!content.includes(section)) fail(`agents/${agent}.md — missing section: ${section}`)
    else pass(`agents/${agent}.md — has ${section}`)
  }
}

// --- Skills ---
const SKILL_FRONTMATTER = ['name:', 'description:', 'triggers:']
const SKILL_SECTIONS = ['## Purpose', '## Workflow', '## Usage']
const SKILLS = ['audit', 'tdd', 'build-contract', 'deploy', 'gas-optimize', 'fork-test', 'full-protocol', 'learn', 'help']

console.log('\n=== Skills ===')
for (const skill of SKILLS) {
  const path = join(root, 'skills', skill, 'SKILL.md')
  if (!existsSync(path)) { fail(`skills/${skill}/SKILL.md — file missing`); continue }
  const content = readFileSync(path, 'utf8')
  for (const field of SKILL_FRONTMATTER) {
    if (!content.includes(field)) fail(`skills/${skill}/SKILL.md — missing frontmatter: ${field}`)
    else pass(`skills/${skill}/SKILL.md — has ${field}`)
  }
  for (const section of SKILL_SECTIONS) {
    if (!content.includes(section)) fail(`skills/${skill}/SKILL.md — missing section: ${section}`)
    else pass(`skills/${skill}/SKILL.md — has ${section}`)
  }
}

// --- CLAUDE.md ---
console.log('\n=== CLAUDE.md ===')
const claudePath = join(root, 'CLAUDE.md')
if (!existsSync(claudePath)) {
  fail('CLAUDE.md — file missing')
} else {
  const content = readFileSync(claudePath, 'utf8')
  for (let i = 1; i <= 8; i++) {
    if (!content.includes(`## Block ${i}`)) fail(`CLAUDE.md — missing Block ${i}`)
    else pass(`CLAUDE.md — has Block ${i}`)
  }
}

// --- Plugin manifest ---
console.log('\n=== Plugin Manifest ===')
const pluginPath = join(root, '.claude-plugin', 'plugin.json')
if (!existsSync(pluginPath)) {
  fail('.claude-plugin/plugin.json — file missing')
} else {
  const plugin = JSON.parse(readFileSync(pluginPath, 'utf8'))
  for (const field of ['name', 'version', 'description', 'skills', 'mcpServers']) {
    if (!plugin[field]) fail(`plugin.json — missing field: ${field}`)
    else pass(`plugin.json — has "${field}"`)
  }
}

// --- MCP bundle ---
console.log('\n=== MCP Bundle ===')
const bundlePath = join(root, 'mcp', 'hud-server.cjs')
if (!existsSync(bundlePath)) fail('mcp/hud-server.cjs — not built (run: npm run build)')
else pass('mcp/hud-server.cjs — bundle exists')

console.log(`\n${errors === 0 ? '✅ All validations passed' : `❌ ${errors} error(s) found`}`)
process.exit(errors > 0 ? 1 : 0)

// mcp/server.ts
// MCP server entry point. Wires HUDServer to MCP protocol.
// Bundled to mcp/hud-server.cjs via scripts/bundle-mcp.mjs.

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { HUDServer } from './hud-server.js'

const hud = new HUDServer()

const server = new Server(
  { name: 'eth-agents-hud', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'eth_skill_start',
      description: 'Called by orchestrator on skill entry. Reports skill name and total pipeline phases.',
      inputSchema: {
        type: 'object',
        properties: {
          skill: { type: 'string', description: 'Skill name (e.g. "full-protocol", "audit")' },
          totalPhases: { type: 'number', description: 'Total number of pipeline phases (1 for single-phase skills)' }
        },
        required: ['skill', 'totalPhases']
      }
    },
    {
      name: 'eth_phase_update',
      description: 'Called by orchestrator when entering a new pipeline phase.',
      inputSchema: {
        type: 'object',
        properties: {
          current: { type: 'number', description: 'Current phase number (1-based)' },
          label: { type: 'string', description: 'Human-readable phase label' }
        },
        required: ['current', 'label']
      }
    },
    {
      name: 'eth_agent_update',
      description: 'Called by any agent on start (active) and on completion (done).',
      inputSchema: {
        type: 'object',
        properties: {
          agent: { type: 'string', description: 'Agent name (e.g. "auditor", "contract-developer")' },
          status: { type: 'string', enum: ['active', 'done'], description: '"active" when starting, "done" when complete' }
        },
        required: ['agent', 'status']
      }
    },
    {
      name: 'eth_token_update',
      description: 'Called by any agent on completion. Self-reports approximate token usage.',
      inputSchema: {
        type: 'object',
        properties: {
          outputChars: { type: 'number', description: 'Estimated output character count (used to approximate tokens: chars ÷ 4)' },
          isSubsequentInvocation: { type: 'boolean', description: 'true if this is not the first time this skill has been run this session (enables cache hit estimation)' }
        },
        required: ['outputChars', 'isSubsequentInvocation']
      }
    },
    {
      name: 'eth_get_statusline',
      description: 'Returns the current HUD statusline string for Claude Code status bar.',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'eth_reset',
      description: 'Clears all HUD state. Called by orchestrator at pipeline end.',
      inputSchema: { type: 'object', properties: {} }
    }
  ]
}))

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params
  const a = args as Record<string, unknown>

  switch (name) {
    case 'eth_skill_start':
      hud.skillStart(a.skill as string, a.totalPhases as number)
      return { content: [{ type: 'text', text: 'ok' }] }
    case 'eth_phase_update':
      hud.phaseUpdate(a.current as number, a.label as string)
      return { content: [{ type: 'text', text: 'ok' }] }
    case 'eth_agent_update':
      hud.agentUpdate(a.agent as string, a.status as 'active' | 'done')
      return { content: [{ type: 'text', text: 'ok' }] }
    case 'eth_token_update':
      hud.tokenUpdate(a.outputChars as number, a.isSubsequentInvocation as boolean)
      return { content: [{ type: 'text', text: 'ok' }] }
    case 'eth_get_statusline':
      return { content: [{ type: 'text', text: hud.getStatusline() }] }
    case 'eth_reset':
      hud.reset()
      return { content: [{ type: 'text', text: 'ok' }] }
    default:
      throw new Error(`Unknown tool: ${name}`)
  }
})

const transport = new StdioServerTransport()
;(async () => { await server.connect(transport) })()

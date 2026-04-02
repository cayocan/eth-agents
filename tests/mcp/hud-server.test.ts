import { describe, it, expect, beforeEach } from 'vitest'
import { HUDServer } from '../../mcp/hud-server.js'

describe('HUDServer — initial state', () => {
  it('starts idle', () => {
    const s = new HUDServer()
    expect(s.getStatusline()).toBe('⟠ idle')
  })
})

describe('HUDServer — skillStart', () => {
  it('shows skill name after skillStart', () => {
    const s = new HUDServer()
    s.skillStart('audit', 1)
    expect(s.getStatusline()).toContain('[audit]')
  })

  it('resets previous state on new skillStart', () => {
    const s = new HUDServer()
    s.skillStart('audit', 1)
    s.agentUpdate('auditor', 'active')
    s.skillStart('deploy', 1)
    expect(s.getStatusline()).not.toContain('auditor')
    expect(s.getStatusline()).toContain('[deploy]')
  })
})

describe('HUDServer — phaseUpdate', () => {
  it('shows phase when totalPhases > 1', () => {
    const s = new HUDServer()
    s.skillStart('full-protocol', 5)
    s.phaseUpdate(2, 'audit · tests · gas')
    expect(s.getStatusline()).toContain('Phase 2/5')
  })

  it('does not show phase when totalPhases = 1', () => {
    const s = new HUDServer()
    s.skillStart('audit', 1)
    expect(s.getStatusline()).not.toContain('Phase')
  })
})

describe('HUDServer — agentUpdate', () => {
  it('shows active agent with ▶ indicator', () => {
    const s = new HUDServer()
    s.skillStart('audit', 1)
    s.agentUpdate('auditor', 'active')
    expect(s.getStatusline()).toContain('auditor ▶')
  })

  it('removes agent when status is done', () => {
    const s = new HUDServer()
    s.skillStart('audit', 1)
    s.agentUpdate('auditor', 'active')
    s.agentUpdate('auditor', 'done')
    expect(s.getStatusline()).not.toContain('auditor')
  })

  it('shows multiple agents joined by · when active', () => {
    const s = new HUDServer()
    s.skillStart('full-protocol', 5)
    s.agentUpdate('auditor', 'active')
    s.agentUpdate('unit-test-engineer', 'active')
    s.agentUpdate('gas-optimizer', 'active')
    const line = s.getStatusline()
    expect(line).toContain('auditor')
    expect(line).toContain('unit-test-engineer')
    expect(line).toContain('gas-optimizer')
    expect(line).toContain('▶')
  })

  it('does not duplicate agent if added twice', () => {
    const s = new HUDServer()
    s.skillStart('audit', 1)
    s.agentUpdate('auditor', 'active')
    s.agentUpdate('auditor', 'active')
    const matches = s.getStatusline().match(/auditor/g)
    expect(matches?.length).toBe(1)
  })
})

describe('HUDServer — tokenUpdate', () => {
  it('shows token count (chars ÷ 4, rounded to k)', () => {
    const s = new HUDServer()
    s.skillStart('audit', 1)
    s.tokenUpdate(56000, false)
    expect(s.getStatusline()).toContain('14k tokens')
  })

  it('shows 80% cached on subsequent invocation', () => {
    const s = new HUDServer()
    s.skillStart('audit', 1)
    s.tokenUpdate(4000, true)
    expect(s.getStatusline()).toContain('80% cached')
  })

  it('does not show cache rate on first invocation', () => {
    const s = new HUDServer()
    s.skillStart('audit', 1)
    s.tokenUpdate(4000, false)
    expect(s.getStatusline()).not.toContain('cached')
  })

  it('accumulates token counts across multiple calls', () => {
    const s = new HUDServer()
    s.skillStart('full-protocol', 5)
    s.tokenUpdate(16000, false) // 4k
    s.tokenUpdate(16000, false) // 4k more
    expect(s.getStatusline()).toContain('8k tokens')
  })
})

describe('HUDServer — reset', () => {
  it('returns to idle after reset', () => {
    const s = new HUDServer()
    s.skillStart('audit', 1)
    s.agentUpdate('auditor', 'active')
    s.tokenUpdate(8000, false)
    s.reset()
    expect(s.getStatusline()).toBe('⟠ idle')
  })
})

describe('HUDServer — statusline format', () => {
  it('full-protocol phase 2 with agent and tokens', () => {
    const s = new HUDServer()
    s.skillStart('full-protocol', 5)
    s.phaseUpdate(2, 'audit · tests · gas')
    s.agentUpdate('auditor', 'active')
    s.tokenUpdate(56000, false)
    expect(s.getStatusline()).toBe('⟠ [full-protocol] Phase 2/5 | auditor ▶ | 14k tokens')
  })

  it('single-phase skill with agent and tokens', () => {
    const s = new HUDServer()
    s.skillStart('audit', 1)
    s.agentUpdate('security-specialist', 'active')
    s.tokenUpdate(32000, false)
    expect(s.getStatusline()).toBe('⟠ [audit] security-specialist ▶ | 8k tokens')
  })

  it('skill only, no agents, no tokens', () => {
    const s = new HUDServer()
    s.skillStart('help', 1)
    expect(s.getStatusline()).toBe('⟠ [help]')
  })

  it('cached tokens format', () => {
    const s = new HUDServer()
    s.skillStart('audit', 1)
    s.agentUpdate('auditor', 'active')
    s.tokenUpdate(32000, true)
    expect(s.getStatusline()).toBe('⟠ [audit] auditor ▶ | 8k tokens · 80% cached')
  })
})

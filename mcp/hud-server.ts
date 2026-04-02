// mcp/hud-server.ts
// Exported HUDServer class — pure state management, no MCP dependencies.
// Testable in isolation.

export interface HUDState {
  activeSkill: string | null
  phase: { current: number; total: number; label: string } | null
  activeAgents: string[]
  tokenCount: number
  cacheHitRate: number
}

export class HUDServer {
  private state: HUDState = {
    activeSkill: null,
    phase: null,
    activeAgents: [],
    tokenCount: 0,
    cacheHitRate: 0,
  }

  skillStart(skill: string, totalPhases: number): void {
    this.state = {
      activeSkill: skill,
      phase: totalPhases > 1 ? { current: 0, total: totalPhases, label: '' } : null,
      activeAgents: [],
      tokenCount: 0,
      cacheHitRate: 0,
    }
  }

  phaseUpdate(current: number, label: string): void {
    if (this.state.phase) {
      this.state.phase.current = current
      this.state.phase.label = label
    }
  }

  agentUpdate(agent: string, status: 'active' | 'done'): void {
    if (status === 'active') {
      if (!this.state.activeAgents.includes(agent)) {
        this.state.activeAgents = [...this.state.activeAgents, agent]
      }
    } else {
      this.state.activeAgents = this.state.activeAgents.filter(a => a !== agent)
    }
  }

  tokenUpdate(outputChars: number, isSubsequentInvocation: boolean): void {
    this.state.tokenCount += Math.round(outputChars / 4)
    if (isSubsequentInvocation) this.state.cacheHitRate = 80
  }

  reset(): void {
    this.state = { activeSkill: null, phase: null, activeAgents: [], tokenCount: 0, cacheHitRate: 0 }
  }

  getStatusline(): string {
    const { activeSkill, phase, activeAgents, tokenCount, cacheHitRate } = this.state
    if (!activeSkill) return '⟠ idle'

    const hasPhase = phase !== null && phase.current > 0
    const hasAgents = activeAgents.length > 0
    const hasTokens = tokenCount > 0

    // First segment: skill name + optional phase (no pipe separator between them)
    let result = `⟠ [${activeSkill}]`
    if (hasPhase) result += ` Phase ${phase!.current}/${phase!.total}`

    const pipeParts: string[] = []

    if (hasAgents) {
      const agentStr = `${activeAgents.join(' · ')} ▶`
      if (hasPhase) {
        // Phase exists: agent segment is pipe-separated
        pipeParts.push(agentStr)
      } else {
        // No phase: agent comes right after skill name with space
        result += ` ${agentStr}`
      }
    }

    if (hasTokens) {
      const kTokens = Math.round(tokenCount / 1000)
      const tokenStr = kTokens > 0 ? `${kTokens}k tokens` : `${tokenCount} tokens`
      const cacheStr = cacheHitRate > 0 ? ` · ${cacheHitRate}% cached` : ''
      pipeParts.push(`${tokenStr}${cacheStr}`)
    }

    if (pipeParts.length > 0) result += ' | ' + pipeParts.join(' | ')
    return result
  }
}

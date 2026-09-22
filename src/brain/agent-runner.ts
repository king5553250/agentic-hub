/**
 * OMNI-BRAIN AGENT RUNNER
 * 24/7 autonomous swarm. Each agent runs continuously, syncs every 10s.
 */

import { MemoryCore } from './memory-core';
import { MirrorEngine } from './mirror-engine';
import { TaskRouter } from './task-router';

export type AgentRole = 'scout' | 'architect' | 'optimizer' | 'librarian' | 'orchestrator' | 'envoy';

export interface AgentConfig {
  id: string; role: AgentRole; memory: MemoryCore;
  mirror: MirrorEngine; router: TaskRouter; checkInterval: number;
}

export interface AgentHeartbeat {
  agentId: string; role: AgentRole; lastRun: string;
  cyclesCompleted: number; currentTask: string | null;
  status: 'idle' | 'running' | 'error' | 'dead';
}

export class AgentRunner {
  private agents: Map<string, AgentConfig> = new Map();
  private heartbeats: Map<string, AgentHeartbeat> = new Map();
  private running: boolean = false;

  deploy(config: AgentConfig): void {
    this.agents.set(config.id, config);
    this.heartbeats.set(config.id, {
      agentId: config.id, role: config.role,
      lastRun: new Date().toISOString(), cyclesCompleted: 0,
      currentTask: null, status: 'idle',
    });
    console.log('[Swarm] Agent ' + config.role + ' (' + config.id + ') deployed.');
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    for (const [id, config] of this.agents) this.runAgentLoop(id, config);
    setInterval(() => this.syncHeartbeats(), 10000);
    console.log('[Swarm] All ' + this.agents.size + ' agents running. 10s heartbeat active.');
  }

  stop(): void {
    this.running = false;
    for (const [id] of this.agents) { const hb = this.heartbeats.get(id); if (hb) hb.status = 'dead'; }
    console.log('[Swarm] All agents stopped.');
  }

  getSwarmStatus(): AgentHeartbeat[] { return Array.from(this.heartbeats.values()); }

  private async runAgentLoop(id: string, config: AgentConfig): Promise<void> {
    const executeCycle = async () => {
      if (!this.running) return;
      const hb = this.heartbeats.get(id)!;
      hb.status = 'running'; hb.currentTask = this.getTaskForRole(config.role);
      try {
        if (config.role === 'librarian') {
          config.memory.startPersistenceLoop();
          config.memory.store({
            type: 'experience',
            content: 'Librarian sync cycle ' + hb.cyclesCompleted + ' - ' + config.memory.getSize() + ' entries in memory',
            tags: ['librarian', 'sync'], sessionId: id, metadata: { cycle: hb.cyclesCompleted },
          });
        }
        if (config.role === 'envoy') {
          const status = this.getSwarmStatus();
          config.memory.store({
            type: 'task',
            content: 'Envoy report: ' + status.filter(s => s.status === 'running').length + '/' + status.length + ' agents active',
            tags: ['envoy', 'report'], sessionId: id, metadata: { swarmStatus: status },
          });
        }
        hb.status = 'idle'; hb.lastRun = new Date().toISOString();
        hb.cyclesCompleted++; hb.currentTask = null;
      } catch (err) { hb.status = 'error'; }
      setTimeout(executeCycle, config.checkInterval);
    };
    executeCycle();
  }

  private getTaskForRole(role: AgentRole): string {
    const tasks: Record<AgentRole, string> = {
      scout: 'Researching latest tools and APIs',
      architect: 'Building infrastructure and code',
      optimizer: 'Analyzing cycles for improvements',
      librarian: 'Syncing memory to durable storage',
      orchestrator: 'Routing tasks between agents',
      envoy: 'Preparing status report for user',
    };
    return tasks[role];
  }

  private syncHeartbeats(): void {
    const active = Array.from(this.heartbeats.values()).filter(h => h.status !== 'dead').length;
    console.log('[Swarm Heartbeat] ' + active + '/' + this.agents.size + ' agents alive');
  }
}

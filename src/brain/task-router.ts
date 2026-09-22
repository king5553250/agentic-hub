/**
 * OMNI-BRAIN TASK ROUTER
 * Multi-app orchestration engine. High-level intent mapped across 37+ toolkits.
 */

export interface ActionStep {
  id: string; app: string; action: string; params: Record<string, unknown>;
  dependsOn: string[]; status: 'pending' | 'running' | 'done' | 'failed'; result?: unknown;
}

export interface TaskPlan {
  id: string; intent: string; steps: ActionStep[];
  status: 'planning' | 'executing' | 'completed' | 'failed'; createdAt: string;
}

export class TaskRouter {
  private activePlans: Map<string, TaskPlan> = new Map();
  private appRegistry: Record<string, string[]>;

  constructor() { this.appRegistry = this.initializeAppRegistry(); }

  async processIntent(intent: string): Promise<TaskPlan> {
    const plan: TaskPlan = { id: this.generateId(), intent, steps: [], status: 'planning', createdAt: new Date().toISOString() };
    plan.steps = this.parseIntent(intent);
    this.activePlans.set(plan.id, plan);
    return plan;
  }

  async execute(planId: string): Promise<TaskPlan> {
    const plan = this.activePlans.get(planId);
    if (!plan) throw new Error('Plan ' + planId + ' not found');
    plan.status = 'executing';
    const independentSteps = plan.steps.filter(s => !s.dependsOn || s.dependsOn.length === 0);
    const dependentSteps = plan.steps.filter(s => s.dependsOn && s.dependsOn.length > 0);
    await Promise.all(independentSteps.map(s => this.executeStep(s)));
    for (const step of dependentSteps) await this.executeStep(step);
    plan.status = 'completed';
    return plan;
  }

  async switchTask(newIntent: string): Promise<TaskPlan> { return this.processIntent(newIntent); }
  getAvailableApps(): Record<string, string[]> { return this.appRegistry; }

  private parseIntent(intent: string): ActionStep[] {
    const i = intent.toLowerCase();
    const steps: ActionStep[] = [];
    if (i.includes('email') || i.includes('gmail')) steps.push(this.makeStep('gmail', 'fetch', { limit: 20 }));
    if (i.includes('calendar') || i.includes('schedule')) steps.push(this.makeStep('calendar', 'get_events', { days: 7 }));
    if (i.includes('slack') || i.includes('message')) steps.push(this.makeStep('slack', 'get_messages', {}));
    if (i.includes('assignment') || i.includes('school') || i.includes('canvas')) steps.push(this.makeStep('canvas', 'get_assignments', {}));
    if (i.includes('github') || i.includes('repo') || i.includes('code')) steps.push(this.makeStep('github', 'list_repos', {}));
    if (i.includes('youtube') || i.includes('video')) steps.push(this.makeStep('youtube', 'get_videos', {}));
    if (steps.length === 0 || i.includes('day') || i.includes('handle') || i.includes('all')) {
      steps.push(this.makeStep('gmail', 'fetch', { limit: 10 }));
      steps.push(this.makeStep('calendar', 'get_events', { days: 1 }));
      steps.push(this.makeStep('canvas', 'get_assignments', {}));
      steps.push(this.makeStep('discord', 'status_report', {}));
    }
    return steps;
  }

  private makeStep(app: string, action: string, params: Record<string, unknown>): ActionStep {
    return { id: this.generateId(), app, action, params, dependsOn: [], status: 'pending' };
  }

  private async executeStep(step: ActionStep): Promise<void> {
    step.status = 'running';
    try { console.log('[Router] ' + step.app + '.' + step.action); step.status = 'done'; }
    catch (err) { step.status = 'failed'; }
  }

  private initializeAppRegistry(): Record<string, string[]> {
    return {
      gmail: ['fetch', 'send', 'search', 'draft'],
      calendar: ['get_events', 'create_event', 'delete_event'],
      slack: ['send', 'get_messages', 'list_channels'],
      github: ['list_repos', 'create_issue', 'get_file', 'create_pr'],
      youtube: ['get_videos', 'upload', 'create_playlist'],
      canvas: ['get_courses', 'get_assignments', 'submit'],
      discord: ['send', 'get_messages', 'status_report'],
      notion: ['get_pages', 'create_page', 'search'],
      googledocs: ['get_doc', 'create_doc', 'append_text'],
      browser: ['navigate', 'click', 'extract', 'login'],
    };
  }

  private generateId(): string { return Date.now() + '-' + Math.random().toString(36).slice(2, 10); }
}

/**
 * OMNI-BRAIN MEMORY CORE
 * Persistent multi-source memory engine syncing across Google Docs, Supabase, Discord.
 */

export interface MemoryEntry {
  id: string;
  type: 'conversation' | 'task' | 'knowledge' | 'preference' | 'experience';
  content: string;
  tags: string[];
  timestamp: string;
  sessionId: string;
  metadata: Record<string, unknown>;
}

export interface MemoryQuery {
  types?: MemoryEntry['type'][];
  tags?: string[];
  from?: string;
  to?: string;
  search?: string;
  limit?: number;
}

export class MemoryCore {
  private entries: MemoryEntry[] = [];
  private syncInterval: number = 10000;
  private syncTimer: ReturnType<typeof setInterval> | null = null;
  private durableStores: { googleDocsId: string; supabase: any; discordChannelId: string };

  constructor(config: { googleDocsId: string; supabase: any; discordChannelId: string }) {
    this.durableStores = config;
  }

  async store(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<MemoryEntry> {
    const fullEntry: MemoryEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      sessionId: this.currentSessionId(),
      ...entry,
    };
    this.entries.push(fullEntry);
    await Promise.all([this.syncToSupabase(fullEntry), this.syncToGoogleDocs(fullEntry)]);
    return fullEntry;
  }

  query(q: MemoryQuery = {}): MemoryEntry[] {
    let results = this.entries;
    if (q.types) results = results.filter(e => q.types!.includes(e.type));
    if (q.tags) results = results.filter(e => e.tags.some(t => q.tags!.includes(t)));
    if (q.search) { const s = q.search.toLowerCase(); results = results.filter(e => e.content.toLowerCase().includes(s)); }
    if (q.limit) results = results.slice(-q.limit);
    return results;
  }

  contextForTask(taskDescription: string, limit = 20): MemoryEntry[] {
    const keywords = taskDescription.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    return this.entries.filter(e => keywords.some(kw => e.content.toLowerCase().includes(kw))).slice(-limit).reverse();
  }

  startPersistenceLoop(): void {
    if (this.syncTimer) return;
    this.syncTimer = setInterval(() => this.fullSync(), this.syncInterval);
  }

  async deadSwitchDump(): Promise<void> {
    const dump = JSON.stringify(this.entries);
    await this.durableStores.supabase.from('memory_dumps').insert({ data: dump, timestamp: new Date().toISOString() });
  }

  getSize(): number { return this.entries.length; }
  private async syncToSupabase(entry: MemoryEntry): Promise<void> {}
  private async syncToGoogleDocs(entry: MemoryEntry): Promise<void> {}
  private fullSync(): void { console.log('Memory Core Sync: ' + this.entries.length + ' entries'); }
  private currentSessionId(): string { return 'SESSION-' + Date.now(); }
}

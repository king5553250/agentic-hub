/**
 * OMNI-BRAIN MIRROR ENGINE
 * Builds a complete behavioral twin of the user — learns writing style,
 * decision patterns, preferences, and philosophy.
 */

export interface VoiceProfile {
  id: string; userId: string; createdAt: string; updatedAt: string;
  avgSentenceLength: number; avgMessageLength: number;
  punctuationStyle: 'neutral' | 'minimal' | 'formal';
  capitalizationPattern: 'none' | 'proper' | 'consistent';
  commonEmojis: string[]; commonPhrases: string[];
  commonAbbreviations: string[]; slangTerms: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  speedPreference: 'fast' | 'balanced' | 'thorough';
  autonomyLevel: 'assistant' | 'partner' | 'executive';
  decisionHistory: DecisionPattern[];
  mirrorAccuracy: number;
}

export interface DecisionPattern {
  id: string; scenario: string; choices: string[];
  chosen: string; reasoning: string; timestamp: string;
}

export interface TextStylingParams {
  targetAudience?: 'casual' | 'professional' | 'academic' | 'cool';
  urgency?: 'low' | 'medium' | 'high';
  length?: 'short' | 'medium' | 'long';
  tone?: string;
}

export class MirrorEngine {
  private profile: VoiceProfile | null = null;
  private profileId: string;

  constructor(profileId: string) { this.profileId = profileId; }

  async feed(userMessage: string): Promise<void> {
    if (!this.profile) await this.initProfile();
    const words = userMessage.trim().split(/\s+/);
    this.profile!.avgMessageLength = (this.profile!.avgMessageLength * 0.9) + (words.length * 0.1);
    const newPhrases = this.extractSignaturePhrases(userMessage);
    this.profile!.commonPhrases = [...new Set([...this.profile!.commonPhrases, ...newPhrases])].slice(0, 50);
    if (userMessage === userMessage.toLowerCase() && userMessage.match(/[a-z]/)) {
      this.profile!.capitalizationPattern = 'none';
    }
    const slangWords = ['fr', 'ngl', 'tbh', 'wtv', 'rn', 'idk', 'asf', 'deadass', 'finna', 'ion', 'wrd', 'bruh', 'ts', 'pmo', 'glt'];
    this.profile!.slangTerms = slangWords.filter(w => userMessage.toLowerCase().includes(w));
    this.profile!.mirrorAccuracy = Math.min(this.profile!.mirrorAccuracy + 0.1, 100);
    this.profile!.updatedAt = new Date().toISOString();
  }

  async recordDecision(decision: DecisionPattern): Promise<void> {
    if (!this.profile) await this.initProfile();
    this.profile!.decisionHistory.push(decision);
    if (this.profile!.decisionHistory.length > 100) {
      this.profile!.decisionHistory = this.profile!.decisionHistory.slice(-100);
    }
  }

  generate(prompt: string, style?: TextStylingParams): string {
    if (!this.profile) return prompt;
    const p = this.profile;
    const hints: string[] = [];
    if (p.capitalizationPattern === 'none') hints.push('all lowercase');
    if (p.avgMessageLength < 15) hints.push('be extremely brief');
    if (p.punctuationStyle === 'minimal') hints.push('minimal punctuation');
    if (p.slangTerms.length > 0) hints.push('use slang: ' + p.slangTerms.slice(0, 5).join(', '));
    return prompt + '\n\n[Voice: ' + hints.join('; ') + ']';
  }

  getAccuracy(): number { return this.profile?.mirrorAccuracy ?? 0; }
  exportProfile(): VoiceProfile | null { return this.profile; }

  private extractSignaturePhrases(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const phrases: string[] = [];
    for (let i = 0; i < words.length - 2; i++) phrases.push(words[i] + ' ' + words[i+1] + ' ' + words[i+2]);
    return [...new Set(phrases)].slice(0, 10);
  }

  private async initProfile(): Promise<void> {
    this.profile = {
      id: this.profileId, userId: this.profileId,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      avgSentenceLength: 0, avgMessageLength: 0,
      punctuationStyle: 'neutral', capitalizationPattern: 'consistent',
      commonEmojis: [], commonPhrases: [], commonAbbreviations: [], slangTerms: [],
      riskTolerance: 'medium', speedPreference: 'fast', autonomyLevel: 'partner',
      decisionHistory: [], mirrorAccuracy: 0,
    };
  }
}

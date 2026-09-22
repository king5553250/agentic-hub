-- OMNI-BRAIN SUPABASE SCHEMA
-- Structured brain: user profiles, memory, voice, agents, tasks

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS voice_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  avg_sentence_length FLOAT DEFAULT 0,
  avg_message_length FLOAT DEFAULT 0,
  punctuation_style TEXT DEFAULT 'neutral',
  capitalization_pattern TEXT DEFAULT 'consistent',
  common_phrases TEXT[] DEFAULT '{}',
  slang_terms TEXT[] DEFAULT '{}',
  risk_tolerance TEXT DEFAULT 'medium',
  speed_preference TEXT DEFAULT 'fast',
  autonomy_level TEXT DEFAULT 'partner',
  mirror_accuracy FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS memory_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('conversation','task','knowledge','preference','experience')),
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  session_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS decision_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_profile_id UUID REFERENCES voice_profiles(id) ON DELETE CASCADE,
  scenario TEXT NOT NULL,
  choices TEXT[] DEFAULT '{}',
  chosen TEXT,
  reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  intent TEXT NOT NULL,
  steps JSONB DEFAULT '[]',
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning','executing','completed','failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_heartbeats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  agent_role TEXT NOT NULL,
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle','running','error','dead')),
  cycles_completed INTEGER DEFAULT 0,
  current_task TEXT,
  last_run TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS memory_dumps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memory_type ON memory_entries(type);
CREATE INDEX IF NOT EXISTS idx_memory_tags ON memory_entries USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_memory_created ON memory_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_status ON agent_heartbeats(status);
CREATE INDEX IF NOT EXISTS idx_task_status ON task_plans(status);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_heartbeats ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_dumps ENABLE ROW LEVEL SECURITY;

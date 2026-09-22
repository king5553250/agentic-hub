-- OMNI-BRAIN SEED DATA
-- Initial state after project creation 2026-09-22

-- User: The Architect
INSERT INTO user_profiles (id, email, display_name, preferences)
VALUES ('70ea83a4-175a-493e-b61a-c0ef2f102383', 'mahdilouz02@gmail.com', 'The Architect', 
  '{"style":"direct","mode":"boss","autonomy":"full"}')
ON CONFLICT (email) DO NOTHING;

-- Voice Profile: fast-paced, lowercase, minimal punctuation
INSERT INTO voice_profiles (id, user_id, avg_message_length, capitalization_pattern, punctuation_style, 
  slang_terms, speed_preference, risk_tolerance, autonomy_level, mirror_accuracy)
VALUES ('b3526277-dd80-4565-887c-f7697eae1fb1', '70ea83a4-175a-493e-b61a-c0ef2f102383', 12, 
  'none', 'minimal', ARRAY['fr','ngl','tbh','wtv','rn','asf','deadass','ion','wrd','bruh','ts','pmo','glt'],
  'fast', 'high', 'executive', 5.0)
ON CONFLICT DO NOTHING;

-- 6 Swarm Agents
INSERT INTO agent_heartbeats (agent_id, agent_role, status) VALUES
  ('swarm-scout-01', 'scout', 'idle'),
  ('swarm-architect-01', 'architect', 'idle'),
  ('swarm-optimizer-01', 'optimizer', 'idle'),
  ('swarm-librarian-01', 'librarian', 'idle'),
  ('swarm-orchestrator-01', 'orchestrator', 'idle'),
  ('swarm-envoy-01', 'envoy', 'idle')
ON CONFLICT DO NOTHING;

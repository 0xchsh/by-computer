-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'design', 'all-access')),
  trial_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Design', 'Video', 'Office')),
  webhook_url TEXT NOT NULL,
  description TEXT NOT NULL,
  input_schema_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create outputs table
CREATE TABLE IF NOT EXISTS outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_slug TEXT NOT NULL REFERENCES agents(slug),
  input_json JSONB NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_outputs_user_id ON outputs(user_id);
CREATE INDEX IF NOT EXISTS idx_outputs_agent_slug ON outputs(agent_slug);
CREATE INDEX IF NOT EXISTS idx_outputs_created_at ON outputs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE outputs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Agents policies (everyone can read)
CREATE POLICY "Agents are viewable by everyone" ON agents
  FOR SELECT USING (true);

-- Outputs policies
CREATE POLICY "Users can view own outputs" ON outputs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own outputs" ON outputs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, plan, trial_end_date)
  VALUES (
    new.id,
    new.email,
    'free',
    NOW() + INTERVAL '14 days'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample agents
INSERT INTO agents (name, slug, category, webhook_url, description, input_schema_json) VALUES
(
  'Ad Generator',
  'ad-generator',
  'Design',
  'https://n8n.yoursite.com/webhook/ad-generator',
  'Generate professional advertisement designs with AI',
  '{
    "fields": {
      "input": {
        "type": "text",
        "label": "What kind of ad do you want to create?",
        "placeholder": "e.g., Launching a coffee brand",
        "required": true
      },
      "style": {
        "type": "select",
        "label": "Choose a style",
        "options": ["Minimalist", "Bold & Colorful", "Professional", "Playful", "Luxury"],
        "required": true
      },
      "text": {
        "type": "text",
        "label": "Text to include (optional)",
        "placeholder": "e.g., Available Now – Brew Better",
        "required": false
      }
    }
  }'
),
(
  'Logo Designer',
  'logo-designer',
  'Design',
  'https://n8n.yoursite.com/webhook/logo-designer',
  'Create unique logos for your brand',
  '{
    "fields": {
      "input": {
        "type": "text",
        "label": "Describe your brand",
        "placeholder": "e.g., Tech startup focused on AI",
        "required": true
      },
      "style": {
        "type": "select",
        "label": "Logo style",
        "options": ["Modern", "Classic", "Playful", "Minimal", "Abstract"],
        "required": true
      },
      "text": {
        "type": "text",
        "label": "Company name",
        "placeholder": "e.g., TechCorp",
        "required": true
      }
    }
  }'
),
(
  'Social Media Post',
  'social-media-post',
  'Design',
  'https://n8n.yoursite.com/webhook/social-media-post',
  'Design eye-catching social media posts',
  '{
    "fields": {
      "input": {
        "type": "text",
        "label": "What is your post about?",
        "placeholder": "e.g., New product launch announcement",
        "required": true
      },
      "style": {
        "type": "select",
        "label": "Visual style",
        "options": ["Instagram Story", "Twitter Post", "LinkedIn Professional", "Facebook Cover"],
        "required": true
      },
      "text": {
        "type": "text",
        "label": "Post text (optional)",
        "placeholder": "e.g., Exciting news coming soon!",
        "required": false
      }
    }
  }'
);
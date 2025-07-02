import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { Agent, AgentFormData } from '@/types'

export async function getAgents(): Promise<Agent[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    return null
  }

  return data
}

export async function getAgentsServer(): Promise<Agent[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function executeAgent(
  agent: Agent, 
  formData: AgentFormData,
  userId: string
): Promise<{ file_url: string; output_id: string }> {
  // Call the n8n webhook
  const response = await fetch(agent.webhook_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: formData.input,
      style: formData.style,
      text: formData.text || '',
      agent_slug: agent.slug,
      user_id: userId,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to execute agent')
  }

  const result = await response.json()
  
  if (!result.file_url) {
    throw new Error('Agent did not return a file URL')
  }

  // Save the output to database
  const supabase = createClient()
  const { data: output, error } = await supabase
    .from('outputs')
    .insert({
      user_id: userId,
      agent_slug: agent.slug,
      input_json: formData,
      file_url: result.file_url,
    })
    .select()
    .single()

  if (error) {
    throw new Error('Failed to save output')
  }

  return {
    file_url: result.file_url,
    output_id: output.id,
  }
}
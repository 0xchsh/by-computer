export interface User {
  id: string
  email: string
  plan: 'free' | 'design' | 'all-access'
  trial_end_date: string
  created_at: string
}

export interface Agent {
  id: string
  name: string
  slug: string
  category: 'Design' | 'Video' | 'Office'
  webhook_url: string
  description: string
  input_schema_json: AgentInputSchema
}

export interface AgentInputSchema {
  fields: {
    input: {
      type: 'text'
      label: string
      placeholder?: string
      required: boolean
    }
    style: {
      type: 'select' | 'text'
      label: string
      options?: string[]
      placeholder?: string
      required: boolean
    }
    text?: {
      type: 'text'
      label: string
      placeholder?: string
      required: boolean
    }
  }
}

export interface Output {
  id: string
  user_id: string
  agent_slug: string
  input_json: Record<string, any>
  file_url: string
  created_at: string
}

export interface AgentFormData {
  input: string
  style: string
  text?: string
}
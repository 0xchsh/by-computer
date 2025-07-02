'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Agent, AgentFormData } from '@/types'
import { executeAgent } from '@/lib/agents'
import { useAuth } from '@/hooks/useAuth'

interface AgentFormProps {
  agent: Agent
}

export function AgentForm({ agent }: AgentFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<AgentFormData>({
    input: '',
    style: '',
    text: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const result = await executeAgent(agent, formData, user.id)
      router.push(`/outputs/${result.output_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof AgentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const schema = agent.input_schema_json.fields

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{agent.name}</CardTitle>
        <CardDescription>{agent.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input field */}
          <div className="space-y-2">
            <Label htmlFor="input">{schema.input.label}</Label>
            <Input
              id="input"
              value={formData.input}
              onChange={(e) => handleInputChange('input', e.target.value)}
              placeholder={schema.input.placeholder}
              required={schema.input.required}
              disabled={loading}
            />
          </div>

          {/* Style field */}
          <div className="space-y-2">
            <Label htmlFor="style">{schema.style.label}</Label>
            {schema.style.type === 'select' && schema.style.options ? (
              <select
                id="style"
                value={formData.style}
                onChange={(e) => handleInputChange('style', e.target.value)}
                required={schema.style.required}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a style...</option>
                {schema.style.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id="style"
                value={formData.style}
                onChange={(e) => handleInputChange('style', e.target.value)}
                placeholder={schema.style.placeholder}
                required={schema.style.required}
                disabled={loading}
              />
            )}
          </div>

          {/* Text field (optional) */}
          {schema.text && (
            <div className="space-y-2">
              <Label htmlFor="text">{schema.text.label}</Label>
              <Input
                id="text"
                value={formData.text}
                onChange={(e) => handleInputChange('text', e.target.value)}
                placeholder={schema.text.placeholder}
                required={schema.text.required}
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
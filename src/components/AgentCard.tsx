import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Agent } from '@/types'

interface AgentCardProps {
  agent: Agent
  hasAccess: boolean
}

export function AgentCard({ agent, hasAccess }: AgentCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{agent.name}</CardTitle>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full">
            {agent.category}
          </span>
        </div>
        <CardDescription className="flex-1">
          {agent.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 mt-auto">
        {hasAccess ? (
          <Button asChild className="w-full">
            <Link href={`/agents/${agent.slug}`}>
              Open Agent
            </Link>
          </Button>
        ) : (
          <div className="space-y-2">
            <Button disabled className="w-full">
              Upgrade Required
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Subscribe to access this agent
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
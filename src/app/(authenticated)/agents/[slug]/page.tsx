import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AgentForm } from '@/components/AgentForm'
import { getAgentsServer } from '@/lib/agents'
import { getUser, hasAccessToCategory } from '@/lib/auth-server'

interface AgentPageProps {
  params: Promise<{ slug: string }>
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params
  const [user, agents] = await Promise.all([
    getUser(),
    getAgentsServer(),
  ])

  if (!user) {
    return <div>Not authenticated</div>
  }

  const agent = agents.find(a => a.slug === slug)
  
  if (!agent) {
    notFound()
  }

  const userHasAccess = await hasAccessToCategory(user, agent.category)

  if (!userHasAccess) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Catalog
            </Link>
          </Button>
        </div>
        
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold">{agent.name}</h1>
          <p className="text-lg text-muted-foreground">{agent.description}</p>
          <div className="p-6 bg-yellow-50 rounded-lg border">
            <h2 className="font-semibold mb-2">Upgrade Required</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This agent requires a subscription to access. Upgrade your plan to use this agent.
            </p>
            <Button asChild>
              <Link href="/pricing">
                View Pricing Plans
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Link>
        </Button>
      </div>
      
      <AgentForm agent={agent} />
    </div>
  )
}
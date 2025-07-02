import { getAgentsServer } from '@/lib/agents'
import { getUser, hasAccessToCategory } from '@/lib/auth-server'
import { AgentCard } from '@/components/AgentCard'

export default async function DashboardPage() {
  const [user, agents] = await Promise.all([
    getUser(),
    getAgentsServer(),
  ])

  if (!user) {
    return <div>Not authenticated</div>
  }

  // Group agents by category
  const agentsByCategory = agents.reduce((acc, agent) => {
    if (!acc[agent.category]) {
      acc[agent.category] = []
    }
    acc[agent.category].push(agent)
    return acc
  }, {} as Record<string, typeof agents>)

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Agent Catalog</h1>
        <p className="text-muted-foreground mt-2">
          Choose an AI agent to generate your creative output
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
          <p className="text-sm">
            <strong>Trial Status:</strong> {user.plan === 'free' ? 'Free Trial Active' : `${user.plan} Plan`}
            {user.plan === 'free' && (
              <span className="ml-2 text-blue-600">
                (Expires: {new Date(user.trial_end_date).toLocaleDateString()})
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(agentsByCategory).map(([category, categoryAgents]) => (
          <div key={category}>
            <h2 className="text-2xl font-semibold mb-4">{category} Agents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryAgents.map(async (agent) => {
                const userHasAccess = await hasAccessToCategory(user, agent.category)
                return (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    hasAccess={userHasAccess}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
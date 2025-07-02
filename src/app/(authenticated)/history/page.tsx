import Link from 'next/link'
import { Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth-server'

export default async function HistoryPage() {
  const user = await getUser()
  
  if (!user) {
    return <div>Not authenticated</div>
  }

  const supabase = await createClient()
  
  // Get user's outputs
  const { data: outputs, error } = await supabase
    .from('outputs')
    .select(`
      *,
      agents (
        name,
        slug
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching outputs:', error)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Output History</h1>
        <p className="text-muted-foreground mt-2">
          View and download your previously generated outputs
        </p>
      </div>

      {!outputs || outputs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">No outputs yet</h3>
            <p className="text-muted-foreground mb-4">
              Start generating content with our AI agents
            </p>
            <Button asChild>
              <Link href="/dashboard">
                Browse Agents
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outputs.map((output) => {
            const agent = output.agents as any
            return (
              <Card key={output.id} className="overflow-hidden">
                <div className="aspect-square bg-gray-100 p-4">
                  <img
                    src={output.file_url}
                    alt="Generated output"
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Preview not available</div>'
                      }
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{agent?.name}</CardTitle>
                  <CardDescription>
                    {new Date(output.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/outputs/${output.id}`}>
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <a href={output.file_url} download target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
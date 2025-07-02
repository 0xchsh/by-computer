import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth-server'

interface OutputPageProps {
  params: Promise<{ id: string }>
}

export default async function OutputPage({ params }: OutputPageProps) {
  const { id } = await params
  const user = await getUser()
  
  if (!user) {
    return <div>Not authenticated</div>
  }

  const supabase = await createClient()
  
  // Get the output
  const { data: output, error } = await supabase
    .from('outputs')
    .select(`
      *,
      agents (
        name,
        slug,
        description
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !output) {
    notFound()
  }

  const agent = output.agents as any

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Output Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Output</CardTitle>
              <CardDescription>
                Created {new Date(output.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Image preview */}
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <img
                    src={output.file_url}
                    alt="Generated output"
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = '<p class="text-muted-foreground">Preview not available</p>'
                      }
                    }}
                  />
                </div>
                
                {/* Download button */}
                <Button asChild className="w-full">
                  <a href={output.file_url} download target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Info & Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{agent.name}</CardTitle>
              <CardDescription>{agent.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Input Parameters:</h4>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  {Object.entries(output.input_json).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium capitalize">{key}:</span>{' '}
                      <span className="text-muted-foreground">{value as string || 'Not provided'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button asChild className="w-full" variant="outline">
                <Link href={`/agents/${agent.slug}`}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Generate Again
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link href="/history">
                  View All Outputs
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">
                  Try Another Agent
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
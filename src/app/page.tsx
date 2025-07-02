import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Design Agent Platform
        </h1>
        <p className="text-xl text-muted-foreground">
          AI-powered design agents that generate creative outputs from your ideas. 
          Start your 14-day free trial today.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">
              Start Free Trial
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/sign-in">
              Sign In
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Design Agents</h3>
            <p className="text-sm text-muted-foreground">
              Create ads, logos, and social media posts with AI
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Video Agents</h3>
            <p className="text-sm text-muted-foreground">
              Generate video content and animations
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Office Agents</h3>
            <p className="text-sm text-muted-foreground">
              Create presentations, reports, and documents
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
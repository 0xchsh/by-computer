'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user) {
    return null
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-xl font-bold">
              Design Agent Platform
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Agents
              </Link>
              <Link 
                href="/history" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                History
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user.email}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {user.plan === 'free' ? 'Trial' : user.plan}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:ml-2 sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
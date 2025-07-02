import { createClient } from '@/lib/supabase/server'
import { User } from '@/types'

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !userData) {
    return null
  }

  return userData
}

export async function requireAuth(): Promise<User> {
  const user = await getUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export async function checkTrialStatus(user: User): Promise<boolean> {
  if (user.plan !== 'free') {
    return true // Paid users always have access
  }
  
  const trialEndDate = new Date(user.trial_end_date)
  const now = new Date()
  
  return now < trialEndDate
}

export async function hasAccessToCategory(user: User, category: string): Promise<boolean> {
  // Check if trial is active
  const hasActiveTrial = await checkTrialStatus(user)
  
  if (hasActiveTrial && user.plan === 'free') {
    return true // Free trial users have full access
  }
  
  // Check plan-specific access
  switch (user.plan) {
    case 'design':
      return category === 'Design'
    case 'all-access':
      return true
    default:
      return false // Expired free users have no access
  }
}
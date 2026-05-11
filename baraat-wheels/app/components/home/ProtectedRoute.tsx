// components/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'

type UserRole = 'customer' | 'partner' | 'admin'

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['customer', 'partner', 'admin'] as UserRole[]
}: { 
  children: React.ReactNode
  allowedRoles?: UserRole[]
}) {
  const { user, isReady } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Wait until auth check completes
    if (!isReady) return

    // Not logged in → send to login
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    // Wrong role → send to their correct dashboard
    if (!allowedRoles.includes(user.role)) {
      const redirectMap: Record<string, string> = {
        customer: '/dashboard',
        partner: '/partner/dashboard',
        admin: '/admin/dashboard'
      }
      router.replace(redirectMap[user.role] || '/')
    }
  }, [user, isReady, router, pathname, allowedRoles])

  // Show nothing while checking auth
  if (!isReady || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  // Wrong role → render nothing (redirect happening)
  if (!allowedRoles.includes(user.role)) return null

  return <>{children}</>
}
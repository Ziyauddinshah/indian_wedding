// app/contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type User = {
  id: string
  name: string
  email: string
  phone: string
  role: 'customer' | 'partner' | 'admin'
  avatar?: string | null
}

type PartnerStatus = {
  verificationStatus: 'pending' | 'approved' | 'rejected' | null
  rejectionReason?: string
  submittedAt?: Date
}

// Add to AuthContextType
type AuthContextType = {
  user: User | null
  partnerStatus: PartnerStatus | null
  isLoading: boolean
  login: (userData: User, token: string, partnerStatusData?: PartnerStatus) => void
  logout: () => void
  updatePartnerStatus: (status: PartnerStatus) => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus | null>(null)

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('baraat_user')
    const storedToken = localStorage.getItem('baraat_token')
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])
  
  const login = (userData: User, token: string, partnerStatusData?: PartnerStatus) => {
    // ... existing code
    setUser(userData)
    localStorage.setItem('baraat_user', JSON.stringify(userData))
    localStorage.setItem('baraat_token', token)
    
    // Optional: Set cookie for server-side access
    document.cookie = `baraat_token=${token}; path=/; max-age=2592000` // 30 days
    document.cookie = `baraat_role=${userData.role}; path=/; max-age=2592000`
    if (partnerStatusData) {
      setPartnerStatus(partnerStatusData)
      localStorage.setItem('baraat_partner_status', JSON.stringify(partnerStatusData))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('baraat_user')
    localStorage.removeItem('baraat_token')
    
    // Clear cookies
    document.cookie = 'baraat_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'baraat_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('baraat_user', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser, partnerStatus, updatePartnerStatus: setPartnerStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

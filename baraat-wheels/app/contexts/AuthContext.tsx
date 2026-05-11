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

type VerificationStatus = {
  verificationStatus: 'pending' | 'approved' | 'rejected' | null
  rejectionReason?: string
  submittedAt?: Date
}

type AuthContextType = {
  user: User | null
  userVerificationStatus: VerificationStatus | null
  isLoading: boolean
  isReady: boolean // ✅ New: true after initial auth check completes
  login: (userData: User, token: string, userVerificationStatus?: VerificationStatus) => void
  logout: () => void
  updateUserVerificationStatus: (status: VerificationStatus) => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false) // ✅ Prevents flash of login page
  const [userVerificationStatus, setUserVerificationStatus] = useState<VerificationStatus | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    const storedUserVerificationStatus = localStorage.getItem('user_verification_status')
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      if (storedUserVerificationStatus) {
        setUserVerificationStatus(JSON.parse(storedUserVerificationStatus))
      }
    }
    
    setIsLoading(false)
    setIsReady(true) // ✅ Auth check complete
  }, [])

  const login = (userData: User, token: string, userVerificationStatus?: VerificationStatus) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', token)
    
    // Set cookies for middleware/server access
    document.cookie = `token=${token}; path=/; max-age=2592000`
    document.cookie = `role=${userData.role}; path=/; max-age=2592000`
    
    if (userVerificationStatus) {
      setUserVerificationStatus(userVerificationStatus)
      localStorage.setItem('user_verification_status', JSON.stringify(userVerificationStatus))
    }
  }

  const logout = () => {
    setUser(null)
    setUserVerificationStatus(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('user_verification_status')
    
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const updateUserVerificationStatus = (status: VerificationStatus) => {
    setUserVerificationStatus(status)
    localStorage.setItem('user_verification_status', JSON.stringify(status))
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isReady,
      login, 
      logout, 
      updateUser, 
      userVerificationStatus, 
      updateUserVerificationStatus 
    }}>
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

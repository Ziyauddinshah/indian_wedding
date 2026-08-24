'use client'

import { useState,useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { authApi, getApiError } from '../lib/api'
import Cookies from 'js-cookie'
import { useAuth } from '@/app/contexts/AuthContext'


type UserType = 'customer' | 'partner' | 'admin'

const ROLE_REDIRECT = {
  admin: '/admin/dashboard',
  partner: '/partner/dashboard',
  customer: '/customer/dashboard',
}

const ROLE_COLORS = {
  admin: {
    gradient: 'from-violet-600 to-purple-600',
    focusColor: 'violet-500',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-500',
    icon: '👑',
  },
  customer: {
    gradient: 'from-indigo-600 to-blue-600',
    focusColor: 'indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-500',
    icon: '👤',
  },
  partner: {
    gradient: 'from-emerald-600 to-teal-600',
    focusColor: 'emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-500',
    icon: '🤝',
  },
}

export default function LoginPage() {
  const router = useRouter()
  const { user, login, isReady } = useAuth()
  const searchParams = useSearchParams()

  const redirectParam = searchParams.get('redirect') || ''
  
  const [selectedType, setSelectedType] = useState<UserType>('customer')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminCode: '',
    rememberMe: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const currentColors = ROLE_COLORS[selectedType]

  // Auto‑redirect if already logged in
  useEffect(() => {
    console.log('Auth state changed. User:', user, 'isReady:', isReady)
    if (isReady && user) {
      console.log('User is already logged in:', user)
      router.push('/customer/dashboard'); // or role-based redirect
    }
  }, [user, isReady, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: selectedType,
        rememberMe: formData.rememberMe,
        ...(selectedType === 'admin' && { adminCode: formData.adminCode }),
      }

      const response = await authApi.login(payload)

      console.log('API response:', response)
      if(response?.status !== 200 && !response?.data?.success) {
        setError(getApiError(response) || 'Login failed. Please check your credentials.')
        setLoading(false)
        return
      }
      
      const { user, token } = response?.data
      console.log('API response:', response)
      
      // Role mismatch check
      if (user.role !== selectedType) {
        setError(
          `This account is registered as "${user.role}". Please select the "${user.role}" tab and try again.`
        )
        setLoading(false)
        return
      }

      
      // Partner pending approval
      if (user.role === 'partner' && user.isApproved == false) {
        // Save token to a cookie (accessible by middleware)
        Cookies.set('token', token, {
          expires: formData.rememberMe ? 30 : 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        })
        Cookies.set('role', user.role, {
          expires: formData.rememberMe ? 30 : 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        })
        console.log('Redirecting to pending approval page for partner:', user)
        setLoading(false)
        // router.push('/partner/pending-approval')
        return
      }

      // Account deactivated check
      if (!user.isActive) {
        setError('Your account has been deactivated. Please contact support.')
        setLoading(false)
        return
      }

      // Save token
      Cookies.set('token', token, {
        expires: formData.rememberMe ? 30 : 1,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      })

      Cookies.set('role', user.role, {
        expires: formData.rememberMe ? 30 : 1,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      })

      // Update auth context
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isApproved: user.isApproved,
      }

      login(userData, { verificationStatus: user.isApproved ? 'approved' : 'pending' })
      // Redirect
      const redirectParam = searchParams.get('redirect')
      const destination = redirectParam?.startsWith('/') && !redirectParam.includes('//')
        ? redirectParam
        : ROLE_REDIRECT[user.role]
      router.push(destination)
      setLoading(false)
    } catch (err) {
      console.error('Login error:', err)
      setError(getApiError(err) || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-5 bg-gradient-to-br ${currentColors.gradient} transition-all duration-500`}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                VehicleRental
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* User Type Selector - 3 Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-8 bg-gray-100 p-1.5 rounded-xl">
            {(['customer', 'partner', 'admin'] as UserType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`py-3 px-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  selectedType === type
                    ? `bg-gradient-to-r ${ROLE_COLORS[type].gradient} text-white shadow-md`
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="text-xl mb-1">{ROLE_COLORS[type].icon}</div>
                <div className="capitalize">{type}</div>
              </button>
            ))}
          </div>

          {/* Role Description */}
          <div className={`mb-6 p-3 rounded-lg ${currentColors.bgColor} ${currentColors.textColor} text-center text-sm font-medium`}>
            {selectedType === 'admin' && 'Platform Management Access'}
            {selectedType === 'partner' && 'Vehicle Partner Dashboard'}
            {selectedType === 'customer' && 'Book Vehicles & Manage Trips'}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}      
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                {selectedType === 'partner' ? 'Business Email' : 'Email Address'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={
                  selectedType === 'admin'
                    ? 'admin@vehiclerental.com'
                    : selectedType === 'partner'
                    ? 'business@company.com'
                    : 'you@example.com'
                }
                className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-${currentColors.focusColor} transition-colors text-sm`}
                autoComplete="on" 
              />
            </div>

            {/* Admin Secret Code - Only for Admin */}
            {selectedType === 'admin' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Admin Secret Code
                </label>
                <input
                  type="password"
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleChange}
                  required
                  placeholder="Enter admin secret code"
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-${currentColors.focusColor} transition-colors text-sm`}
                  autoComplete="current-password" 
                />
                <p className="mt-1 text-xs text-gray-500">
                  Contact super admin to get your secret code
                </p>
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-${currentColors.focusColor} transition-colors text-sm`}
                autoComplete="current-password" 
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  autoCapitalize='off'
                />
                <span className="ml-2 text-gray-700 text-sm">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className={`text-sm font-medium bg-gradient-to-r ${currentColors.gradient} bg-clip-text text-transparent hover:opacity-80`}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${currentColors.gradient} text-white py-3.5 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                `Sign in as ${selectedType}`
              )}
            </button>
          </form>


          {/* Partner Info */}
          {selectedType === 'partner' && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-800 text-center">
                🚗 New partners get 0% commission for first 30 days!
              </p>
            </div>
          )}

          {/* Admin Info */}
          {selectedType === 'admin' && (
            <div className="mt-6 p-4 bg-violet-50 rounded-xl border border-violet-100">
              <p className="text-sm text-violet-800 text-center">
                🔐 Secure admin access only. All actions are logged.
              </p>
            </div>
          )}

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              {selectedType === 'admin' ? "Need admin access?" : "Don't have an account?"}{' '}
              <Link
                href={selectedType === 'admin' ? '/admin/request-access' : '/register'}
                className={`font-semibold bg-gradient-to-r ${currentColors.gradient} bg-clip-text text-transparent hover:opacity-80`}
              >
                {selectedType === 'admin' ? 'Request Access' : 'Sign up'}
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-white/90 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

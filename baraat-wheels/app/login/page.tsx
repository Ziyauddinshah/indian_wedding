'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type UserType = 'customer' | 'partner' | 'admin'

export default function LoginPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<UserType>('customer')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminCode: '',
    rememberMe: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const userTypes = [
    {
      type: 'customer' as UserType,
      icon: '👤',
      label: 'Customer',
      description: 'Access services',
      gradient: 'from-indigo-600 to-pink-600',
      focusColor: 'indigo-500',
    },
    {
      type: 'partner' as UserType,
      icon: '🤝',
      label: 'Partner',
      description: 'Business dashboard',
      gradient: 'from-emerald-600 to-teal-600',
      focusColor: 'emerald-500',
    },
  ]

  const currentType = userTypes.find(t => t.type === selectedType)!

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/auth/login/${selectedType}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log(`${selectedType} login:`, formData)
      router.push(`/dashboard/${selectedType}`)
    } catch (err) {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-5 bg-gradient-to-br ${currentType.gradient} transition-all duration-500`}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                ServiceHub
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* User Type Selector */}
          <div className="grid grid-cols-2 gap-2 mb-8 bg-gray-100 p-1.5 rounded-xl">
            {userTypes.map((type) => (
              <button
                key={type.type}
                type="button"
                onClick={() => setSelectedType(type.type)}
                className={`py-3 px-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  selectedType === type.type
                    ? `bg-gradient-to-r ${type.gradient} text-white shadow-md`
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div>{type.label}</div>
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
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
                    ? 'admin@example.com'
                    : selectedType === 'partner'
                    ? 'business@example.com'
                    : 'you@example.com'
                }
                className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-${currentType.focusColor} transition-colors`}
              />
            </div>

            {/* Admin Code Field - Only for Admin */}
            {selectedType === 'admin' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Admin Code
                </label>
                <input
                  type="password"
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleChange}
                  required
                  placeholder="Enter admin code"
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-${currentType.focusColor} transition-colors`}
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-${currentType.focusColor} transition-colors`}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className={`w-4 h-4 text-${currentType.focusColor} border-gray-300 rounded focus:ring-2 focus:ring-${currentType.focusColor}`}
                />
                <span className="ml-2 text-gray-700 text-sm">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className={`text-sm font-medium bg-gradient-to-r ${currentType.gradient} bg-clip-text text-transparent hover:opacity-80`}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${currentType.gradient} text-white py-3.5 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Social Login - Only for Customer */}
          {selectedType === 'customer' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            </>
          )}

          {/* Special Messages */}
          {selectedType === 'partner' && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl text-center">
              <p className="text-sm text-emerald-800">
                🎉 New partners get 30 days free trial!
              </p>
            </div>
          )}

          {/* {selectedType === 'admin' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Need admin access?{' '}
                <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Contact Support
                </Link>
              </p>
            </div>
          )} */}

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {selectedType === 'admin' ? "Don't have access?" : "Don't have an account?"}{' '}
              <Link
                href="/register"
                className={`font-semibold bg-gradient-to-r ${currentType.gradient} bg-clip-text text-transparent hover:opacity-80`}
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
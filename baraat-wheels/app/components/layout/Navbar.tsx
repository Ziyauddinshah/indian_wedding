// app/components/layout/Navbar.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Sparkles, Phone, User, Menu, X, LogOut, Heart, Calendar, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  // Guard against undefined name
  const getUserInitials = () => {
    if (!user?.name) return ''
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getNavLinks = () => {
    const commonLinks = [{ name: 'Browse Vehicles', href: '/vehicles' }]
    if (user?.role) {  // FIX: Optional chaining
      if (user.role === 'customer') {
        return [
          ...commonLinks,
          { name: 'Dashboard', href: '/customer/dashboard' },
          { name: 'My Bookings', href: '/customer/bookings' },
          { name: 'Wishlist', href: '/customer/wishlist' },
        ]
      } else if (user.role === 'partner') {
        return [
          ...commonLinks,
          { name: 'Dashboard', href: '/partner/dashboard' },
          { name: 'My Vehicles', href: '/partner/vehicles' },
          { name: 'Earnings', href: '/partner/earnings' },
        ]
      } else if (user.role === 'admin') {
        return [
          ...commonLinks,
          { name: 'Admin Panel', href: '/admin/dashboard' },
        ]
      }
    }
    return commonLinks
  }

  const getUserMenuItems = () => {
    if (!user?.role) return []  // FIX: Optional chaining
    if (user.role === 'customer') {
      return [
        { label: 'Dashboard', href: '/customer/dashboard', icon: Calendar },
        { label: 'My Bookings', href: '/customer/bookings', icon: Calendar },
        { label: 'Wishlist', href: '/customer/wishlist', icon: Heart },
        { label: 'Profile', href: '/customer/profile', icon: Settings },
      ]
    } else if (user.role === 'partner') {
      return [
        { label: 'Dashboard', href: '/partner/dashboard', icon: Calendar },
        { label: 'Vehicles', href: '/partner/vehicles', icon: Calendar },
        { label: 'Earnings', href: '/partner/earnings', icon: Calendar },
        { label: 'Profile', href: '/partner/profile', icon: Settings },
      ]
    } else if (user.role === 'admin') {
      return [
        { label: 'Dashboard', href: '/admin/dashboard', icon: Calendar },
        { label: 'Partners', href: '/admin/partners', icon: Calendar },
        { label: 'Vehicles', href: '/admin/vehicles', icon: Calendar },
        { label: 'Profile', href: '/admin/profile', icon: Settings },
      ]
    }
    return []
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    window.location.href = '/'
  }

  const navLinks = getNavLinks()
  const userMenuItems = getUserMenuItems()

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#8B0000] via-[#B91C1C] to-[#8B0000]">
      <div className="h-1 bg-gradient-to-r from-[#FFD700] via-[#FF9933] to-[#FFD700]"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tighter">
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                  BaraatWheels
                </span>
              </h1>
              <p className="text-xs text-yellow-200 font-medium flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Royal Entrances, Unforgettable Memories
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center space-x-2"
              >
                <span className="text-white font-semibold group-hover:text-yellow-300 transition-colors relative">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all group">
              <Phone className="h-4 w-4 text-yellow-300 mr-2" />
              <span className="text-white font-semibold">Call Now</span>
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none group"
                >
                  <div className="relative">
                    {user.avatar ? (  // FIX: user.avatar could be undefined/null
                      <img
                        src={user.avatar}
                        alt={user.name || 'User'}  // FIX: Fallback alt
                        className="h-10 w-10 rounded-full object-cover border-2 border-yellow-400"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-[#8B0000] font-bold text-lg border-2 border-white">
                        {getUserInitials()}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-white transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                      <div className="px-4 py-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name || 'User'} className="h-12 w-12 rounded-full object-cover" />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                              {getUserInitials()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900">{user.name || 'User'}</p>  {/* FIX */}
                            <p className="text-sm text-gray-500">{user.email || ''}</p>  {/* FIX */}
                            <p className="text-xs text-amber-600 capitalize mt-1">✨ {user.role}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-amber-50 transition-colors"
                          >
                            <item.icon className="h-5 w-5 mr-3 text-gray-400" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        ))}
                        
                        <div className="border-t border-gray-100 my-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-5 w-5 mr-3" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFB347] text-[#8B0000] font-bold rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transform transition-all duration-300 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Get Started
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white font-semibold hover:text-yellow-300 transition-colors py-2 px-4 rounded-lg hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-white/20">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-3 bg-white/10 rounded-xl mb-4">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name || 'User'} className="h-10 w-10 rounded-full" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-[#8B0000] font-bold">
                          {getUserInitials()}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-bold">{user.name || 'User'}</p>
                        <p className="text-yellow-200 text-sm">{user.email || ''}</p>
                      </div>
                    </div>
                    
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center text-white font-semibold hover:text-yellow-300 transition-colors py-2 px-4 rounded-lg hover:bg-white/10"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </Link>
                    ))}
                    
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full text-white font-semibold hover:text-yellow-300 transition-colors py-2 px-4 rounded-lg hover:bg-white/10 mt-2"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFB347] text-[#8B0000] font-bold rounded-xl">
                      Get Started
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
// app/components/layout/Navbar.tsx - VIBRANT VERSION
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Sparkles, Phone, User, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#8B0000] via-[#B91C1C] to-[#8B0000]">
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-[#FFD700] via-[#FF9933] to-[#FFD700]"></div>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo with Sparkles */}
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
            {[
              { name: 'Browse Vehicles', href: '/vehicles' },
              { name: 'For Partners', href: '/partner' },
              { name: 'Gallery', href: '/gallery' },
            ].map((item) => (
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

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all group">
              <Phone className="h-4 w-4 text-yellow-300 mr-2" />
              <span className="text-white font-semibold">Call Now</span>
            </button>
            
            <Link href="/login">
              <button className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFB347] text-[#8B0000] font-bold rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transform transition-all duration-300 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Get Started
              </button>
            </Link>
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
              {['Browse Vehicles', 'Cities', 'For Partners', 'Gallery'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-white font-semibold hover:text-yellow-300 transition-colors py-2 px-4 rounded-lg hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/20">
                <Link href="/login">
                  <button className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFB347] text-[#8B0000] font-bold rounded-xl">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}


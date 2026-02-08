// app/components/home/HeroSection.tsx - VIBRANT VERSION
'use client'

import { useState } from 'react'
import { Search, Star, Award } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  const [searchCity, setSearchCity] = useState('')
  const [searchDate, setSearchDate] = useState('')

  const cities = ['Jaipur', 'Delhi', 'Udaipur', 'Mumbai', 'Hyderabad', 'Goa']

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 mandala-bg">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="container relative mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-full border border-yellow-200">
              <span className="text-yellow-800 font-bold text-sm">Trusted by 500+ Weddings</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-gradient-to-r from-rose-100 to-rose-50 rounded-full border border-rose-200">
              <Star className="h-4 w-4 text-rose-600 mr-2" fill="#DB2777" />
              <span className="text-rose-800 font-bold text-sm">4.9/5 Customer Rating</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight">
            <span className="block text-gray-900">Make Your</span>
            <span className="block mt-2">
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FF9933] to-[#FFD700] bg-clip-text text-transparent animate-gradient">
                Baraat Unforgettable
              </span>
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="mb-10 text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Book majestic <span className="font-bold text-[#8B0000]">Ghodi</span>, 
            luxurious <span className="font-bold text-[#4169E1]">Cars</span>, 
            and royal <span className="font-bold text-[#9333EA]">Elephants </span> 
            for the grandest entrance of your life!
          </p>

          {/* Search Card */}
          <div className="mb-12 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-yellow-200 p-2 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* City Selector */}
                <div className="flex-1">
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    WEDDING LOCATION?
                  </label>
                  <div className="relative">
                    <select 
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-yellow-200 bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 outline-none appearance-none"
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date Picker */}
                <div className="flex-1">
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    WEDDING DATE
                  </label>
                  <input 
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full p-4 rounded-xl border-2 border-yellow-200 bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 outline-none"
                  />
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Link href="/vehicles">
                    <button className="h-full px-8 py-4 bg-gradient-to-r from-[#8B0000] to-[#B91C1C] text-white rounded-xl font-bold shadow-lg shadow-red-900/30 hover:shadow-red-900/50 hover:scale-105 transform transition-all duration-300 flex items-center">
                      <Search className="h-5 w-5 mr-2" />
                      Find Royal Vehicles
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vehicles">
              <button className="px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFB347] text-[#8B0000] font-bold rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transform transition-all duration-300 flex items-center justify-center">
                Explore Royal Collection
              </button>
            </Link>
            
            <Link href="/partner/dashboard">
              <button className="px-8 py-4 bg-white/90 backdrop-blur-sm border-2 border-yellow-400 text-[#8B0000] font-bold rounded-xl shadow-lg hover:shadow-yellow-400/50 hover:scale-105 transform transition-all duration-300 flex items-center justify-center">
                List Your Vehicle
              </button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '500+', label: 'Happy Couples' },
              { number: '200+', label: 'Royal Vehicles' },
              { number: '25+', label: 'Cities' },
              { number: '4.9★', label: 'Rating' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-yellow-400">
                <div className="text-3xl font-bold text-[#8B0000]">{stat.number}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
// app/vehicles/premium/page.tsx
'use client'

import { useState } from 'react'
import { Sparkles, Crown, Award, Shield, Star, Zap, Package, Users } from 'lucide-react'
import Link from 'next/link'

const premiumPackages = [
  {
    id: 'premium-1',
    name: 'Royal Elephant Experience',
    description: 'Complete royal package with elephant, traditional musicians, and full decor',
    price: 85000,
    originalPrice: 100000,
    rating: 4.9,
    reviewCount: 35,
    duration: 'Full Day',
    includes: [
      'Decorated Elephant with Howdah',
      '4 Royal Attendants',
      'Traditional Music Band',
      'Photographer & Videographer',
      'Royal Attire for Groom',
      'Red Carpet & Welcome Setup',
      'Insurance & Security'
    ],
    vehicles: ['Elephant', 'Support Vehicle'],
    theme: 'Royal',
    bestFor: 'Destination Weddings, Royal Families',
    tags: ['Most Popular', 'All Inclusive']
  },
  {
    id: 'premium-2',
    name: 'Luxury Convoy Package',
    description: 'Grand procession with multiple luxury vehicles and full coordination',
    price: 120000,
    rating: 4.8,
    reviewCount: 28,
    duration: 'Full Day',
    includes: [
      'Rolls Royce Phantom (Groom)',
      '2x Mercedes Maybach (Family)',
      '3x Range Rover (Guests)',
      'Professional Chauffeurs',
      'DJ Truck with Sound System',
      'Full Route Coordination',
      'Police Clearance Assistance'
    ],
    vehicles: ['Rolls Royce', 'Mercedes', 'Range Rover'],
    theme: 'Modern Luxury',
    bestFor: 'Large Weddings, Corporate Events',
    tags: ['Convoy', 'Grand']
  },
  {
    id: 'premium-3',
    name: 'Heritage Vintage Package',
    description: 'Vintage car collection with period costumes and classic photography',
    price: 95000,
    rating: 4.7,
    reviewCount: 22,
    duration: '8 Hours',
    includes: [
      '1930s Rolls Royce',
      '1950s Chevrolet',
      'Victorian Horse Carriage',
      'Period Costume Drivers',
      'Classic Photography Session',
      'Vintage Decor Setup',
      'Heritage Route Planning'
    ],
    vehicles: ['Vintage Cars', 'Horse Carriage'],
    theme: 'Vintage',
    bestFor: 'Theme Weddings, Heritage Lovers',
    tags: ['Vintage', 'Classic']
  },
  {
    id: 'premium-4',
    name: 'Ghodi Maharaja Package',
    description: 'Traditional Indian procession with multiple horses and full traditional setup',
    price: 65000,
    rating: 4.8,
    reviewCount: 42,
    duration: '6 Hours',
    includes: [
      '3 Decorated Marwari Horses',
      'Traditional Musicians (Shehnai/Dhol)',
      'Flower Petal Throwers',
      'Traditional Attire for All',
      'Elephant for Family (Optional)',
      'Full Traditional Decor',
      'Cultural Coordinator'
    ],
    vehicles: ['Ghodi/Horses', 'Support Vehicles'],
    theme: 'Traditional Indian',
    bestFor: 'Traditional Weddings, Cultural Events',
    tags: ['Traditional', 'Cultural']
  },
  {
    id: 'premium-5',
    name: 'Beach Wedding Special',
    description: 'Custom package for beach and destination weddings with unique vehicles',
    price: 110000,
    rating: 4.9,
    reviewCount: 19,
    duration: 'Full Day',
    includes: [
      'Convertible Luxury Cars',
      'Beach Buggy Procession',
      'Boat Arrival (if applicable)',
      'Beach Decor Setup',
      'Sunset Photography',
      'Sound System for Beach',
      'Beach Permits & Clearances'
    ],
    vehicles: ['Convertibles', 'Beach Buggies', 'Boats'],
    theme: 'Beach/Destination',
    bestFor: 'Beach Weddings, Goa Destinations',
    tags: ['Destination', 'Unique']
  },
  {
    id: 'premium-6',
    name: 'Platinum Wedding Package',
    description: 'Ultimate all-inclusive package with every luxury imaginable',
    price: 250000,
    rating: 5.0,
    reviewCount: 12,
    duration: '2 Days',
    includes: [
      'All Vehicle Types Available',
      'International Wedding Planner',
      'Celebrity Photographer',
      'Custom Vehicle Decor Design',
      'Fireworks Display',
      'Live Band & DJ',
      '24/7 Dedicated Coordinator',
      'Luxury Accommodation for Guests'
    ],
    vehicles: ['All Types'],
    theme: 'Ultimate Luxury',
    bestFor: 'Celebrity Weddings, Ultra-Luxury Events',
    tags: ['Ultimate', 'All Inclusive']
  },
]

const themes = ['All', 'Royal', 'Modern Luxury', 'Vintage', 'Traditional Indian', 'Beach/Destination', 'Ultimate Luxury']
const durations = ['All', '6 Hours', '8 Hours', 'Full Day', '2 Days']

export default function PremiumVehiclesPage() {
  const [selectedTheme, setSelectedTheme] = useState('All')
  const [selectedDuration, setSelectedDuration] = useState('All')
  const [priceRange, setPriceRange] = useState('all')
  const [showAllIncludes, setShowAllIncludes] = useState<string | null>(null)

  const filteredPackages = premiumPackages.filter(pkg => {
    if (selectedTheme !== 'All' && pkg.theme !== selectedTheme) return false
    if (selectedDuration !== 'All' && pkg.duration !== selectedDuration) return false
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      if (max && pkg.price > max) return false
      if (min && pkg.price < min) return false
    }
    return true
  })

  const sortedPackages = [...filteredPackages].sort((a, b) => {
    if (a.tags.includes('Most Popular')) return -1
    if (b.tags.includes('Most Popular')) return 1
    return b.rating - a.rating
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-orange-800 to-rose-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <Crown className="h-6 w-6 text-yellow-400 mr-3" />
              <span className="text-lg font-bold">PREMIUM WEDDING PACKAGES</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block">Complete Wedding</span>
              <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent">
                Vehicle Packages
              </span>
            </h1>

            <p className="text-xl text-amber-100 mb-10 max-w-3xl mx-auto">
              Stress-free, all-inclusive packages that combine multiple vehicles, decor, 
              coordination, and services for the perfect wedding procession.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Packages', value: '6+', icon: '🎁' },
                { label: 'Themes', value: '6+', icon: '🎭' },
                { label: 'Avg Rating', value: '4.9★', icon: '⭐' },
                { label: 'Complete Weddings', value: '100+', icon: '👰' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-amber-200">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 rounded-full font-bold">
              <Zap className="h-5 w-5 mr-2" />
              Save up to 20% with package deals!
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 space-y-6">
              {/* Theme Filter */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-100 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-amber-600" />
                  Theme
                </h3>
                <div className="space-y-2">
                  {themes.map(theme => (
                    <button
                      key={theme}
                      onClick={() => setSelectedTheme(theme)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedTheme === theme
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-100 p-6">
                <h3 className="text-lg font-bold mb-4">⏰ Duration</h3>
                <div className="space-y-2">
                  {durations.map(duration => (
                    <button
                      key={duration}
                      onClick={() => setSelectedDuration(duration)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedDuration === duration
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-100 p-6">
                <h3 className="text-lg font-bold mb-4">💰 Price Range</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Under ₹80,000', value: '0-80000' },
                    { label: '₹80,000 - ₹1,50,000', value: '80000-150000' },
                    { label: 'Above ₹1,50,000', value: '150000-300000' },
                  ].map(range => (
                    <label key={range.value} className="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="price" 
                        value={range.value}
                        checked={priceRange === range.value}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="h-4 w-4 text-amber-600"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Package Benefits */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Package Benefits
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Shield className="h-4 w-4 mr-3 text-yellow-300" />
                    <span>Single Point Contact</span>
                  </li>
                  <li className="flex items-center">
                    <Package className="h-4 w-4 mr-3 text-yellow-300" />
                    <span>Cost Savings (15-20%)</span>
                  </li>
                  <li className="flex items-center">
                    <Users className="h-4 w-4 mr-3 text-yellow-300" />
                    <span>Dedicated Coordinator</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 mr-3 text-yellow-300" />
                    <span>Priority Service</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-100 p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Premium Wedding Packages
                    <span className="ml-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-bold">
                      {filteredPackages.length} Available
                    </span>
                  </h2>
                  <p className="text-gray-600">All-inclusive solutions for stress-free wedding planning</p>
                </div>

                <div className="text-sm text-gray-600 bg-amber-50 px-4 py-2 rounded-lg">
                  🎯 <span className="font-bold">Pro Tip:</span> Packages save you time, money, and stress!
                </div>
              </div>
            </div>

            {/* Packages Grid */}
            {filteredPackages.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-xl border-2 border-amber-100">
                <div className="text-6xl mb-6">🎁</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No packages found</h3>
                <p className="text-gray-600 mb-8">Try adjusting your filters</p>
                <button
                  onClick={() => {
                    setSelectedTheme('All')
                    setSelectedDuration('All')
                    setPriceRange('all')
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {sortedPackages.map(pkg => (
                  <div key={pkg.id} className="bg-white rounded-2xl shadow-xl border-2 border-amber-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    {/* Package Header */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b border-amber-200">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
                            <div className="flex gap-2">
                              {pkg.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-full text-sm font-bold">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{pkg.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900">
                            ₹{pkg.price.toLocaleString()}
                          </div>
                          {pkg.originalPrice && (
                            <div className="text-lg text-gray-500 line-through">
                              ₹{pkg.originalPrice.toLocaleString()}
                            </div>
                          )}
                          <div className="text-sm text-gray-600 mt-1">{pkg.duration}</div>
                        </div>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Includes */}
                        <div className="lg:col-span-2">
                          <h4 className="text-lg font-bold mb-4 flex items-center">
                            <Package className="h-5 w-5 mr-2 text-amber-600" />
                            What's Included
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(showAllIncludes === pkg.id ? pkg.includes : pkg.includes.slice(0, 6)).map((item, idx) => (
                              <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                                  <span className="text-green-600 text-sm">✓</span>
                                </div>
                                <span className="text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                          {pkg.includes.length > 6 && (
                            <button
                              onClick={() => setShowAllIncludes(showAllIncludes === pkg.id ? null : pkg.id)}
                              className="mt-4 text-amber-600 font-semibold hover:text-amber-700"
                            >
                              {showAllIncludes === pkg.id ? 'Show Less' : `Show ${pkg.includes.length - 6} More`}
                            </button>
                          )}

                          {/* Vehicles */}
                          <div className="mt-6">
                            <h4 className="text-lg font-bold mb-3">🚗 Vehicles Included</h4>
                            <div className="flex flex-wrap gap-2">
                              {pkg.vehicles.map((vehicle, idx) => (
                                <span key={idx} className="px-3 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium">
                                  {vehicle}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Booking Info */}
                        <div className="space-y-6">
                          {/* Rating */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center mb-2">
                              <Star className="h-5 w-5 text-amber-500 fill-amber-500 mr-2" />
                              <span className="font-bold text-lg">{pkg.rating}</span>
                              <span className="text-gray-600 ml-2">({pkg.reviewCount} reviews)</span>
                            </div>
                            <div className="text-sm text-gray-600">Best for: {pkg.bestFor}</div>
                          </div>

                          {/* Theme */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-sm text-gray-600 mb-1">Theme</div>
                            <div className="font-bold text-gray-900">{pkg.theme}</div>
                          </div>

                          {/* Savings */}
                          {pkg.originalPrice && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                              <div className="text-sm text-green-600 mb-1">You Save</div>
                              <div className="font-bold text-green-800 text-xl">
                                ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
                              </div>
                              <div className="text-sm text-green-700">
                                {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% off!
                              </div>
                            </div>
                          )}

                          {/* CTA */}
                          <Link href={`/booking/package/${pkg.id}`}>
                            <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg">
                              Book This Package
                            </button>
                          </Link>

                          <button className="w-full py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors">
                            💬 Customize Package
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Custom Package CTA */}
            <div className="mt-12 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 md:p-12 text-center text-white">
                <h3 className="text-3xl font-bold mb-4">Want a Custom Package?</h3>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Our wedding experts can create a personalized package combining any vehicles, 
                  services, and themes to match your exact vision and budget.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    🎨 Design Custom Package
                  </button>
                  <button className="px-8 py-4 bg-black/20 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all duration-300">
                    📞 Schedule Consultation
                  </button>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="mt-12 bg-white rounded-2xl shadow-xl border-2 border-amber-100 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Package Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-6 text-gray-900 font-bold">Feature</th>
                      {premiumPackages.slice(0, 3).map(pkg => (
                        <th key={pkg.id} className="text-center py-4 px-6">
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-gray-900 mb-1">{pkg.name.split(' ')[0]}</span>
                            <span className="text-sm text-gray-600">₹{pkg.price.toLocaleString()}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Multiple Vehicles', pkg1: '✅', pkg2: '✅', pkg3: '✅' },
                      { feature: 'Dedicated Coordinator', pkg1: '✅', pkg2: '✅', pkg3: '✅' },
                      { feature: 'Photography', pkg1: '✅', pkg2: '✅', pkg3: '✅' },
                      { feature: 'Music Band', pkg1: '✅', pkg2: '❌', pkg3: '✅' },
                      { feature: 'Custom Decor', pkg1: '✅', pkg2: '✅', pkg3: '❌' },
                      { feature: 'Insurance', pkg1: '✅', pkg2: '✅', pkg3: '✅' },
                      { feature: '24/7 Support', pkg1: '✅', pkg2: '✅', pkg3: '✅' },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                        <td className="py-4 px-6 text-center text-2xl">{row.pkg1}</td>
                        <td className="py-4 px-6 text-center text-2xl">{row.pkg2}</td>
                        <td className="py-4 px-6 text-center text-2xl">{row.pkg3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
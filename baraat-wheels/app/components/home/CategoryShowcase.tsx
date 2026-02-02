// app/components/home/CategoryShowcase.tsx - VIBRANT VERSION
'use client'

import { useState } from 'react'
import Link from 'next/link'

const categories = [
  {
    id: 'ghodi',
    name: 'Ghodi & Horses',
    description: 'Majestic decorated horses with golden ornaments',
    color: 'from-yellow-100 to-amber-100',
    borderColor: 'border-yellow-300',
    count: '50+ Available',
    features: ['Pure White Marwari', 'Golden Decorations', 'Trained Handlers'],
  },
  {
    id: 'luxury',
    name: 'Luxury Cars',
    description: 'Rolls Royce, Mercedes Maybach & Premium SUVs',
    color: 'from-blue-100 to-indigo-100',
    borderColor: 'border-blue-300',
    count: '30+ Available',
    features: ['Chauffeur Service', 'Red Carpet', 'Flower Decor'],
  },
  {
    id: 'royal',
    name: 'Royal Vehicles',
    description: 'Elephants, Vintage Cars & Horse Carriages',
    color: 'from-purple-100 to-pink-100',
    borderColor: 'border-purple-300',
    count: '20+ Available',
    features: ['Heritage Experience', 'Royal Treatment', 'Photo Sessions'],
  },
  {
    id: 'premium',
    name: 'Premium Packages',
    description: 'Complete Baraat experience with all amenities',
    color: 'from-emerald-100 to-green-100',
    borderColor: 'border-emerald-300',
    count: '15+ Packages',
    features: ['Full Coordination', 'Decoration', 'Photography'],
  }
]

export default function CategoryShowcase() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <section className="py-20 bg-gradient-to-b from-rose-50 to-orange-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-4">
            <span className="text-white font-bold text-sm">FEATURED COLLECTIONS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-[#8B0000] to-[#B91C1C] bg-clip-text text-transparent">
              Royal Ride
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Each vehicle is carefully selected for quality, tradition, and grandeur
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/vehicles/${category.id}`}>
              <div
                className={`relative h-full festive-card border-4 ${category.borderColor} transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-200/50 cursor-pointer`}
                style={{borderRadius:25+"px"}}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{category.name}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${hoveredCard === category.id ? 'bg-yellow-500 text-[#8B0000]' : 'bg-gray-100 text-gray-700'}`}>
                      {category.count}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{category.description}</p>
                  
                  {/* Features List */}
                  <div className="space-y-2">
                    {category.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-yellow-500 mr-3"></div>
                        <span className="text-sm font-medium text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 hover:text-[#8B0000] transition-colors font-medium">
                      View Collection →
                    </span>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${hoveredCard === category.id ? 'bg-gradient-to-r from-[#FFD700] to-[#FF9933] scale-110' : 'bg-gray-100'}`}>
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                {hoveredCard === category.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl pointer-events-none"></div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/vehicles">
            <button className="px-8 py-4 bg-gradient-to-r from-[#8B0000] to-[#B91C1C] text-white font-bold rounded-xl shadow-lg shadow-red-900/30 hover:shadow-red-900/50 hover:scale-105 transform transition-all duration-300 flex items-center mx-auto">
              Explore All Vehicles
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
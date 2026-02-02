// app/components/home/CitySelector.tsx
'use client'

import { useState } from 'react'
import { MapPin, Sparkles, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const cities = [
  { 
    name: 'Delhi NCR', 
    vehicleCount: 45, 
    popularVehicles: ['Rolls Royce', 'Mercedes Maybach', 'White Ghodi'],
    description: 'The capital city with maximum luxury options',
    color: 'from-blue-500 to-indigo-600',
    tag: 'Most Popular'
  },
  { 
    name: 'Jaipur', 
    vehicleCount: 32, 
    popularVehicles: ['Marwari Horses', 'Elephants', 'Vintage Cars'],
    description: 'The Pink City known for royal weddings',
    color: 'from-amber-500 to-orange-500',
    tag: 'Royal City'
  },
  { 
    name: 'Udaipur', 
    vehicleCount: 28, 
    popularVehicles: ['Lake Palace Arrival', 'Horse Carriages', 'Royal Boats'],
    description: 'City of Lakes with picturesque venues',
    color: 'from-emerald-500 to-teal-600',
    tag: 'Romantic'
  },
  { 
    name: 'Mumbai', 
    vehicleCount: 38, 
    popularVehicles: ['Luxury SUVs', 'Convertibles', 'Modern Cars'],
    description: 'Bollywood style grand entrances',
    color: 'from-purple-500 to-pink-600',
    tag: 'Glamorous'
  },
  { 
    name: 'Hyderabad', 
    vehicleCount: 25, 
    popularVehicles: ['Nizam Style Cars', 'Decorated Horses', 'Premium Sedans'],
    description: 'Nizami culture with royal traditions',
    color: 'from-rose-500 to-red-500',
    tag: 'Traditional'
  },
  { 
    name: 'Goa', 
    vehicleCount: 18, 
    popularVehicles: ['Beach Buggies', 'Convertibles', 'Boats'],
    description: 'Beach weddings with unique vehicles',
    color: 'from-cyan-500 to-blue-500',
    tag: 'Destination'
  }
]

export default function CitySelector() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  return (
    <section className="py-20 bg-gradient-to-b from-white to-amber-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container relative mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-4">
            <span className="text-white font-bold text-sm">TOP WEDDING DESTINATIONS</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Available in{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Major Wedding Cities
            </span>
          </h2>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Experience locally curated vehicles in India's most popular wedding destinations. 
            Each city offers unique vehicles that match local traditions and venues.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {cities.map((city) => (
            <Link 
              key={city.name} 
              href={`/vehicles?city=${city.name.toLowerCase().replace(' ', '-')}`}
              className="group relative"
              onMouseEnter={() => setHoveredCity(city.name)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              <div className="relative h-full overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-105">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${city.color} opacity-90`}></div>

                {/* City Content */}
                <div className="relative p-8 h-full flex flex-col justify-between min-h-[320px]">
                  {/* Top Section */}
                  <div>
                    {/* City Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-2xl font-bold text-white">{city.name}</h3>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-sm">{city.description}</span>
                        </div>
                      </div>
                      
                      {/* Tag */}
                      <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                        <span className="text-white text-sm font-bold">{city.tag}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div>
                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{city.vehicleCount}+</div>
                        <div className="text-white/80 text-sm">Vehicles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">4.8</div>
                        <div className="text-white/80 text-sm">Ratings</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold flex items-center group-hover:text-yellow-300 transition-colors">
                        Explore {city.name} Vehicles
                        <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white">→</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                {hoveredCity === city.name && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Cities */}
        <div className="mt-16">
          <div className="bg-gradient-to-r rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-2xl p-8 md:p-12">
              <h4 className="text-2xl font-bold text-center mb-8">Coming to More Cities Soon!</h4>
              <div className="flex flex-wrap justify-center gap-4">
                {['Chennai', 'Bangalore', 'Kolkata', 'Chandigarh', 'Ahmedabad', 'Lucknow'].map(city => (
                  <div key={city} className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-amber-300 transition-colors">
                    {city}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
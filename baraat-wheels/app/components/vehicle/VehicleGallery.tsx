// app/components/vehicle/VehicleGallery.tsx (Simplified)
'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface VehicleGalleryProps {
  images: string[]
  vehicleType: 'ghodi' | 'luxury' | 'royal'
}

export default function VehicleGallery({ images, vehicleType }: VehicleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const typeConfig = {
    ghodi: { icon: '🐎', color: 'amber' },
    luxury: { icon: '🚗', color: 'blue' },
    royal: { icon: '👑', color: 'purple' }
  }[vehicleType]

  return (
    <div className="space-y-4">
      <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-9xl animate-float">
            {typeConfig.icon}
          </div>
        </div>
        
        <button
          onClick={() => setCurrentIndex(prev => (prev - 1 + images.length) % images.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={() => setCurrentIndex(prev => (prev + 1) % images.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  )
}
// app/components/vehicle/VehicleCard.tsx
import { Star, MapPin, Shield } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'
import { Vehicle } from '@/app/types/vehicle'

interface VehicleCardProps {
  vehicle: Vehicle
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Vehicle Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
        {vehicle.featured && (
          <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Shield className="h-5 w-5 text-white" />
        </div>
      </div>

      <CardContent className="p-5">
        {/* Vehicle Info */}
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold">{vehicle.name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-semibold">{vehicle.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{vehicle.city}</span>
            <span className="mx-2">•</span>
            <span className="capitalize">{vehicle.type}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">₹{vehicle.price.toLocaleString()}</div>
            <div className="text-sm text-gray-500">per day</div>
          </div>
          <Link href={`/vehicles/${vehicle.id}`}>
            <Button>View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
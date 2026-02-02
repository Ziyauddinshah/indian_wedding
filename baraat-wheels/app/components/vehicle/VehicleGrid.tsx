// app/components/vehicle/VehicleGrid.tsx
import VehicleCard from './VehicleCard'
import { Vehicle } from '@/app/types/vehicle'

interface VehicleGridProps {
  vehicles: Vehicle[]
}

export default function VehicleGrid({ vehicles }: VehicleGridProps) {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
        <p className="text-gray-600">Try adjusting your filters or search criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  )
}
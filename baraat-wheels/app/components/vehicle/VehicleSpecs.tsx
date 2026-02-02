// app/components/vehicle/VehicleSpecs.tsx
import { Vehicle } from '@/app/types/vehicle'

interface VehicleSpecsProps {
  vehicle: Vehicle
}

export default function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const specs = [
    { label: 'Vehicle Type', value: vehicle.type === 'ghodi' ? 'Ghodi / Horse' : vehicle.type === 'luxury' ? 'Luxury Car' : 'Royal Vehicle' },
    { label: 'Breed/Make', value: 'Marwari Horse' },
    { label: 'Color', value: 'Pure White' },
    { label: 'Age', value: '6 Years' },
    { label: 'Training', value: '3+ Years Procession Experience' },
    { label: 'Handler Included', value: 'Yes, Experienced Saise' },
    { label: 'Decoration', value: 'Traditional Golden Set' },
    { label: 'Insurance', value: '₹5 Lakhs Coverage' },
    { label: 'Max Distance', value: '10 km per booking' },
    { label: 'Availability', value: 'All wedding season dates' },
  ]

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Specifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specs.map((spec, index) => (
          <div key={index} className="border-b pb-3">
            <div className="text-sm text-gray-500 mb-1">{spec.label}</div>
            <div className="font-medium">{spec.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
// app/components/vehicle/VehicleFilters.tsx
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'

export default function VehicleFilters() {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Vehicle Type */}
        <div>
          <h3 className="font-semibold mb-3">Vehicle Type</h3>
          <div className="space-y-2">
            {['Ghodi/Horse', 'Luxury Cars', 'Royal Vehicles', 'Elephants'].map((type) => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded text-primary" />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* City */}
        <div>
          <h3 className="font-semibold mb-3">City</h3>
          <div className="space-y-2">
            {['Delhi NCR', 'Jaipur', 'Udaipur', 'Mumbai', 'Hyderabad', 'Goa'].map((city) => (
              <label key={city} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded text-primary" />
                <span>{city}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold mb-3">Price Range (per day)</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="price" className="text-primary" />
              <span>Under ₹15,000</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="price" className="text-primary" />
              <span>₹15,000 - ₹30,000</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="price" className="text-primary" />
              <span>₹30,000 - ₹50,000</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="price" className="text-primary" />
              <span>Above ₹50,000</span>
            </label>
          </div>
        </div>

        <Button className="w-full">Apply Filters</Button>
        <Button variant="outline" className="w-full">Clear All</Button>
      </CardContent>
    </Card>
  )
}
import { notFound } from 'next/navigation';
import { Star, MapPin, ArrowLeft, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { isSameDay } from 'date-fns';


// The server component can import the client component
import BookNowModal from '../../components/booking/BookNowModel';

// Mock data (replace with your API/db call)
const mockVehicles = [
  {
    id: '1',
    name: 'White Marwari Horse with Golden Decor',
    type: 'ghodi',
    city: 'Jaipur',
    price: 18000,
    originalPrice: 22000,
    rating: 4.8,
    reviewCount: 42,
    image: '/vehicles/horse-1.jpg',
    featured: true,
    description: 'Pure white Marwari horse with traditional golden ornaments',
    features: ['Golden Saddle', 'Experienced Handler', 'Insurance', 'Practice Session'],
    isAvailable: true,
    partnerRating: 4.9
  },
  {
    id: '2',
    name: 'Rolls Royce Phantom 2024',
    type: 'luxury',
    city: 'Delhi',
    price: 65000,
    rating: 4.9,
    reviewCount: 28,
    image: '/vehicles/rolls-1.jpg',
    featured: true,
    description: 'Brand new Phantom with chauffeur and premium decor',
    features: ['Chauffeur', 'Red Carpet', 'Bar Setup', 'Flower Decor'],
    isAvailable: true,
    partnerRating: 4.8
  },
  {
    id: '3',
    name: 'Vintage 1950s Classic Car',
    type: 'royal',
    city: 'Udaipur',
    price: 45000,
    rating: 4.7,
    reviewCount: 35,
    image: '/vehicles/vintage-1.jpg',
    featured: false,
    description: 'Restored vintage beauty for royal weddings',
    features: ['Restored', 'Classic', 'Photography', 'Royal Attire'],
    isAvailable: true,
    partnerRating: 4.6
  },
  {
    id: '4',
    name: 'Decorated Royal Elephant',
    type: 'royal',
    city: 'Jaipur',
    price: 55000,
    rating: 4.6,
    reviewCount: 31,
    image: '/vehicles/elephant-1.jpg',
    featured: true,
    description: 'Majestic elephant with traditional howdah',
    features: ['Howdah', '4 Attendants', 'Traditional Music', 'Photo Session'],
    isAvailable: true,
    partnerRating: 4.7
  },
  {
    id: '5',
    name: 'Mercedes Maybach S-Class',
    type: 'luxury',
    city: 'Mumbai',
    price: 45000,
    rating: 4.8,
    reviewCount: 24,
    image: '/vehicles/maybach-1.jpg',
    featured: false,
    description: 'Ultimate luxury sedan for grand entrances',
    features: ['Sunroof', 'Leather', 'Entertainment', 'Chauffeur'],
    isAvailable: true,
    partnerRating: 4.8
  },
  {
    id: '6',
    name: 'Kathiawari Horse with Silver Decor',
    type: 'ghodi',
    city: 'Udaipur',
    price: 22000,
    rating: 4.7,
    reviewCount: 38,
    image: '/vehicles/horse-2.jpg',
    featured: false,
    description: 'Stunning Kathiawari horse with silver ornaments',
    features: ['Silver Decor', 'Trained', 'Insurance', 'Handler'],
    isAvailable: true,
    partnerRating: 4.9
  },
  {
    id: '7',
    name: 'Range Rover Autobiography',
    type: 'luxury',
    city: 'Delhi',
    price: 35000,
    rating: 4.5,
    reviewCount: 19,
    image: '/vehicles/rangerover-1.jpg',
    featured: false,
    description: 'Luxury SUV for modern wedding processions',
    features: ['SUV', 'Spacious', 'Premium', 'Chauffeur'],
    isAvailable: true,
    partnerRating: 4.7
  },
  {
    id: '8',
    name: 'Horse Carriage - Victorian Style',
    type: 'royal',
    city: 'Goa',
    price: 38000,
    rating: 4.8,
    reviewCount: 27,
    image: '/vehicles/carriage-1.jpg',
    featured: true,
    description: 'Elegant Victorian-style horse carriage',
    features: ['Victorian', 'Elegant', 'Photogenic', 'Royal'],
    isAvailable: true,
    partnerRating: 4.8
  },
  {
    id: '9',
    name: 'White Arabian Horse',
    type: 'ghodi',
    city: 'Hyderabad',
    price: 20000,
    rating: 4.6,
    reviewCount: 22,
    image: '/vehicles/horse-3.jpg',
    featured: false,
    description: 'Graceful Arabian horse with floral decor',
    features: ['Arabian', 'Floral', 'Trained', 'Handler'],
    isAvailable: true,
    partnerRating: 4.7
  },
]

async function getVehicle(id: string) {
  // Replace with: const res = await fetch(`https://api.example.com/vehicles/${id}`);
  // const data = await res.json();
  // return data;
  const data = mockVehicles.find(v => v.id === id) || null;
  if(!data)
    return mockVehicles[0];
  return data;
}

// Example: generate some dates for the next 30 days
const generateDates = () => {
  const today = new Date();
  const dates: Date[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

// Simulate available dates (all days except some booked ones)
const allDates = generateDates();
const bookedDates = allDates.filter((_, idx) => idx % 5 === 0); // every 5th day is booked
const availableDates = allDates.filter((d) => !bookedDates.some((b) => isSameDay(b, d)));


export default async function SingleVehiclePage({ params }: {
  params: Promise<{ id: string }>;   // Note: params is a Promise now
}) {
  // ✅ Unwrap the Promise before using id
  const { id } = await params;
  const vehicle = await getVehicle(id);
console.log('Fetched vehicle:', vehicle,id);
  if (!vehicle) {
    notFound();
  }

  const typeLabel =
    vehicle.type === 'ghodi' ? 'Horse' :
    vehicle.type === 'luxury' ? 'Luxury Car' :
    'Royal Vehicle';

  const placeholderEmoji =
    vehicle.type === 'ghodi' ? '🐎' :
    vehicle.type === 'luxury' ? '🚗' : '👑';

  const gradientBg =
    vehicle.type === 'ghodi' ? 'from-amber-100 to-yellow-100' :
    vehicle.type === 'luxury' ? 'from-blue-100 to-indigo-100' :
    'from-purple-100 to-pink-100';

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="container relative mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Back button */}
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 text-gray-700 font-medium hover:text-amber-600 transition mb-6"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to all vehicles
            </Link>

            <div className="flex flex-col lg:flex-row gap-10">
              {/* Image / Placeholder Section */}
              <div className="lg:w-1/2">
                <div className={`rounded-3xl overflow-hidden border-4 border-white shadow-2xl h-[400px] ${gradientBg} flex items-center justify-center`}>
                  <div className="text-8xl animate-float">
                    {placeholderEmoji}
                  </div>
                </div>
                {/* Availability badge */}
                {vehicle.isAvailable && (
                  <div className="mt-4 flex gap-3 flex-wrap">
                    <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                      ✅ Available
                    </div>
                    {vehicle.featured && (
                      <div className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-sm font-bold">
                        FEATURED
                      </div>
                    )}
                    <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                      {typeLabel}
                    </div>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="lg:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span className="text-xl font-bold">{vehicle.rating}</span>
                  <span className="text-gray-500">({vehicle.reviewCount} reviews)</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-600">Partner rating {vehicle.partnerRating}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {vehicle.name}
                </h1>

                <div className="flex items-center text-gray-700 mb-6">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="font-medium text-lg">{vehicle.city}</span>
                </div>

                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  {vehicle.description}
                </p>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-3">What's included</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {vehicle.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between mt-auto pt-8 border-t-2 border-gray-200">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      ₹{vehicle.price.toLocaleString()}
                    </div>
                    {vehicle.originalPrice && (
                      <div className="text-sm text-gray-500">
                        <span className="line-through mr-2">₹{vehicle.originalPrice.toLocaleString()}</span>
                        per day
                      </div>
                    )}
                  </div>
                  <BookNowModal
                    availableDates={availableDates}
                    bookedDates={bookedDates}
                    price={vehicle.price}
                    vehicleName={vehicle.name}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
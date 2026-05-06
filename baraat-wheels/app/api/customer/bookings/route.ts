// app/api/customer/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Dummy booking data
const dummyBookings = [
  {
    _id: '1',
    bookingNumber: 'BK-001',
    vehicleId: {
      _id: 'v1',
      name: 'White Marwari Horse',
      company: 'Royal Stables',
      image: '/images/horse.jpg',
      pricePerDay: 15000,
    },
    startDate: '2024-12-15T10:00:00.000Z',
    endDate: '2024-12-15T18:00:00.000Z',
    status: 'confirmed',
    totalPrice: 15000,
    createdAt: '2024-11-01T00:00:00.000Z',
  },
  {
    _id: '2',
    bookingNumber: 'BK-002',
    vehicleId: {
      _id: 'v2',
      name: 'Rolls Royce Phantom',
      company: 'Luxury Wheels',
      image: '/images/rolls.jpg',
      pricePerDay: 55000,
    },
    startDate: '2024-12-20T14:00:00.000Z',
    endDate: '2024-12-20T22:00:00.000Z',
    status: 'pending',
    totalPrice: 55000,
    createdAt: '2024-11-05T00:00:00.000Z',
  },
  {
    _id: '3',
    bookingNumber: 'BK-003',
    vehicleId: {
      _id: 'v3',
      name: 'Vintage Bentley',
      company: 'Classic Motors',
      image: '/images/bentley.jpg',
      pricePerDay: 40000,
    },
    startDate: '2025-01-10T09:00:00.000Z',
    endDate: '2025-01-12T18:00:00.000Z',
    status: 'confirmed',
    totalPrice: 120000,
    createdAt: '2024-12-01T00:00:00.000Z',
  },
];

export async function GET(request: NextRequest) {
  // 1) Authentication check (dummy – always passes if session exists)
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized - Please log in' },
      { status: 401 }
    );
  }

  // 2) Parse query parameters
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  // 3) Apply pagination to dummy data
  const start = (page - 1) * limit;
  const paginatedBookings = dummyBookings.slice(start, start + limit);

  // 4) Return dummy bookings
  return NextResponse.json({
    bookings: paginatedBookings,
    pagination: {
      total: dummyBookings.length,
      page,
      limit,
      totalPages: Math.ceil(dummyBookings.length / limit),
    },
  });
}

async function getServerSession(): Promise<{ user?: { email?: string } } | null> {
  // Dummy session implementation for development
  return { user: { email: 'dummy@example.com' } };
}

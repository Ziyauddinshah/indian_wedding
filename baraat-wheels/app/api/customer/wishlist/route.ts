import { NextRequest, NextResponse } from 'next/server';

// Dummy wishlist data (you can replace with database later)
const dummyWishlist = [
  {
    _id: 'w1',
    vehicleId: {
      _id: 'v4',
      name: 'Kathiawari Horse',
      company: 'Royal Stables',
      pricePerDay: 18000,
      image: '/images/kathiawari.jpg',
      location: 'Jaipur, Rajasthan',
    },
    createdAt: '2024-12-01T00:00:00.000Z',
  },
  {
    _id: 'w2',
    vehicleId: {
      _id: 'v5',
      name: 'Mercedes Maybach',
      company: 'Luxury Wheels',
      pricePerDay: 55000,
      image: '/images/maybach.jpg',
      location: 'Delhi, NCR',
    },
    createdAt: '2024-12-05T00:00:00.000Z',
  },
];

export async function GET(request: NextRequest) {
  // No authentication check at all – assume user is already logged in
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

  const start = (page - 1) * limit;
  const paginated = dummyWishlist.slice(start, start + limit);

  return NextResponse.json({
    wishlist: paginated,
    pagination: {
      total: dummyWishlist.length,
      page,
      limit,
      totalPages: Math.ceil(dummyWishlist.length / limit),
    },
  });
}

export async function DELETE(request: NextRequest) {
  // No auth check
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get('vehicleId');
  if (!vehicleId) {
    return NextResponse.json({ error: 'Vehicle ID required' }, { status: 400 });
  }
  // Perform deletion logic (dummy)
  return NextResponse.json({ success: true });
}
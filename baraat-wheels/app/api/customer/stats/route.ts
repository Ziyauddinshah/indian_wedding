// app/api/customer/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
//   const session = await getServerSession();
//   if (!session?.user?.email) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

  // Dummy statistics – these numbers come from the dummy bookings/wishlist above
  const dummyStats = {
    totalBookings: 3,
    activeBookings: 2, // confirmed/pending with future end date
    wishlistCount: 2,
    reviewsCount: 1,
  };

  return NextResponse.json(dummyStats);
}
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bookings - Partner Dashboard',
  description: 'Manage all your vehicle bookings and reservations',
};

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
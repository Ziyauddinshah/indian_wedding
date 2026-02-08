import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import PartnerSidebar from '@/app/components/partner/Sidebar';
import PartnerHeader from '@/app/components/partner/Header';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Partner Dashboard - Luxury Fleet',
  description: 'Manage your luxury vehicles, ghodi, and royal vehicles',
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100`}>
      <div className="flex">
        {/* Sidebar */}
        <PartnerSidebar />
        
        {/* Main Content */}
        <div className="flex-1">
          <PartnerHeader />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import PartnerSidebar from '@/app/components/partner/Sidebar';
// import PartnerHeader from '@/app/components/partner/Header';
// import '../globals.css';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Partner Dashboard - Luxury Fleet',
//   description: 'Manage your luxury vehicles, ghodi, and royal vehicles',
// };

// export default function PartnerLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className={`${inter.className} min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100`}>
//       <div className="flex">
//         {/* Sidebar */}
//         <PartnerSidebar />
        
//         {/* Main Content */}
//         <div className="flex-1">
//           <PartnerHeader />
//           <main className="p-6">
//             {children}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/partner/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Menu, X } from 'lucide-react'
import PartnerSidebar from '@/app/components/partner/Sidebar'
import PartnerHeader from '@/app/components/partner/Header'
import { useAuth } from '@/app/contexts/AuthContext'
import '../globals.css'

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading: authLoading, partnerStatus } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication and verification status
  useEffect(() => {
    if (!authLoading) {
      // Not logged in
      if (!user) {
        router.push('/partner/dashboard')
        return
      }

      // Wrong role
      if (user.role !== 'partner') {
        router.push('/')
        return
      }

      // Check verification status
      if (partnerStatus?.verificationStatus === 'pending') {
        router.push('/partner/pending-approval')
        return
      }

      if (partnerStatus?.verificationStatus === 'rejected') {
        router.push('/partner/rejection')
        return
      }

      // Approved - show dashboard
      setIsLoading(false)
    }
  }, [user, authLoading, partnerStatus, router])

  // Close mobile menu when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar - Desktop always visible, Mobile conditional */}
        <div className={`
          fixed lg:relative z-50 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-72 flex-shrink-0 h-full overflow-y-auto
        `}>
          <PartnerSidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with Mobile Menu Toggle */}
          <PartnerHeader onMobileMenuClick={toggleMobileMenu} />
          
          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-4 px-6 mt-auto">
            <div className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} BaraatWheels Partner Portal. All rights reserved.
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
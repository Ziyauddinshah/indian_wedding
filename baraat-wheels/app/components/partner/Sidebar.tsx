'use client';

import { useState } from 'react';
import { 
  Home, Car, Calendar, Wallet, Star, Settings, 
  LogOut, Menu, X, Users, TrendingUp 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/partner/dashboard', icon: <Home size={22} />, label: 'Dashboard', color: 'text-purple-600' },
  { href: '/partner/vehicles', icon: <Car size={22} />, label: 'My Vehicles', color: 'text-blue-600' },
  { href: '/partner/bookings', icon: <Calendar size={22} />, label: 'Bookings', color: 'text-emerald-600' },
  { href: '/partner/earnings', icon: <Wallet size={22} />, label: 'Earnings', color: 'text-amber-600' },
  { href: '/partner/performance', icon: <TrendingUp size={22} />, label: 'Performance', color: 'text-pink-600' },
  { href: '/partner/reviews', icon: <Star size={22} />, label: 'Reviews', color: 'text-cyan-600' },
  { href: '/partner/profile', icon: <Users size={22} />, label: 'Profile', color: 'text-indigo-600' },
];

export default function PartnerSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-gradient-to-b from-white to-blue-50
        border-r border-blue-200
        shadow-xl lg:shadow-none
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Car className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LuxePartner
              </h1>
              <p className="text-sm text-blue-600">Premium Fleet Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-3 p-3 rounded-xl
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm' 
                    : 'hover:bg-white hover:shadow-md'
                  }
                `}
              >
                <div className={`${item.color}`}>
                  {item.icon}
                </div>
                <span className={`font-medium ${isActive ? 'text-blue-800' : 'text-gray-700'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Partner Status */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-100 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-emerald-700">Active</span>
              </div>
              <p className="text-sm text-gray-500">Premium Partner</p>
            </div>
            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
              <LogOut className="text-gray-400 group-hover:text-red-500" size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
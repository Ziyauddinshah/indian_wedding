// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { 
//   Search, Bell, HelpCircle, User, Settings, 
//   LogOut, ChevronDown, Zap, Moon, Sun, Star,
//   MessageSquare, Wallet, TrendingUp, Menu, X
// } from 'lucide-react';
// import Link from 'next/link';
// import Image from 'next/image';

// const notifications = [
//   { id: 1, type: 'booking', title: 'New Booking Request', description: 'Mercedes S-Class for wedding', time: '2 min ago', read: false },
//   { id: 2, type: 'payment', title: 'Payment Received', description: '₹25,000 from Aarav Sharma', time: '1 hour ago', read: false },
//   { id: 3, type: 'rating', title: 'New 5-Star Rating', description: 'Excellent service!', time: '3 hours ago', read: true },
//   { id: 4, type: 'alert', title: 'Vehicle Maintenance', description: 'BMW 7 Series needs service', time: '1 day ago', read: true },
// ];

// const quickLinks = [
//   { label: 'My Profile', href: '/partner/profile', icon: <User size={18} /> },
//   { label: 'Account Settings', href: '/partner/settings', icon: <Settings size={18} /> },
//   { label: 'Help Center', href: '/partner/help', icon: <HelpCircle size={18} /> },
//   { label: 'Contact Support', href: '/partner/support', icon: <MessageSquare size={18} /> },
// ];

// export default function PartnerHeader() {
//   const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(2);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [darkMode, setDarkMode] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
//   const notificationsRef = useRef<HTMLDivElement>(null);
//   const profileRef = useRef<HTMLDivElement>(null);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
//         setIsNotificationsOpen(false);
//       }
//       if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
//         setIsProfileOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Mark all as read
//   const markAllAsRead = () => {
//     setUnreadCount(0);
//   };

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     if (!darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   };

//   // Partner data
//   const partnerData = {
//     name: 'Raj Luxury Cars',
//     email: 'raj@luxurycars.com',
//     plan: 'Premium',
//     rating: 4.8,
//     joinDate: '2023-06-15',
//     avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-800">
//       <div className="px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* Left: Search Bar */}
//           <div className="flex items-center gap-4 flex-1 max-w-2xl">
//             {/* Mobile Menu Button */}
//             <button 
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
//             >
//               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>

//             {/* Search Bar */}
//             <div className="flex-1 relative">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search bookings, vehicles, customers..."
//                   className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
//                 />
//                 {searchQuery && (
//                   <button 
//                     onClick={() => setSearchQuery('')}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
              
//               {/* Search Suggestions */}
//               {searchQuery && (
//                 <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
//                   <div className="p-2">
//                     <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">Quick Actions</div>
//                     <button className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
//                       <Search size={16} />
//                       Search "{searchQuery}" in bookings
//                     </button>
//                     <button className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
//                       <TrendingUp size={16} />
//                       View performance for "{searchQuery}"
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right: Actions & Profile */}
//           <div className="flex items-center gap-3">
//             {/* Dark Mode Toggle */}
//             <button
//               onClick={toggleDarkMode}
//               className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//               title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//             >
//               {darkMode ? (
//                 <Sun className="text-amber-500" size={20} />
//               ) : (
//                 <Moon className="text-gray-600 dark:text-gray-400" size={20} />
//               )}
//             </button>

//             {/* Notifications */}
//             <div className="relative" ref={notificationsRef}>
//               <button
//                 onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
//                 className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
//               >
//                 <Bell className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>

//               {/* Notifications Dropdown */}
//               {isNotificationsOpen && (
//                 <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
//                   {/* Header */}
//                   <div className="p-4 border-b border-gray-100 dark:border-gray-700">
//                     <div className="flex items-center justify-between">
//                       <h3 className="font-bold text-gray-800 dark:text-white">Notifications</h3>
//                       <button
//                         onClick={markAllAsRead}
//                         className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//                       >
//                         Mark all as read
//                       </button>
//                     </div>
//                     <div className="flex gap-2 mt-2">
//                       <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
//                         All
//                       </button>
//                       <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
//                         Unread
//                       </button>
//                     </div>
//                   </div>

//                   {/* Notifications List */}
//                   <div className="max-h-96 overflow-y-auto">
//                     {notifications.map((notification) => (
//                       <div
//                         key={notification.id}
//                         className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
//                           !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
//                         }`}
//                       >
//                         <div className="flex items-start gap-3">
//                           <div className={`p-2 rounded-lg ${
//                             notification.type === 'booking' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
//                             notification.type === 'payment' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
//                             notification.type === 'rating' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
//                             'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
//                           }`}>
//                             {notification.type === 'booking' && '📅'}
//                             {notification.type === 'payment' && '💰'}
//                             {notification.type === 'rating' && '⭐'}
//                             {notification.type === 'alert' && '⚠️'}
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex justify-between items-start">
//                               <h4 className="font-semibold text-gray-800 dark:text-white">{notification.title}</h4>
//                               {!notification.read && (
//                                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                               )}
//                             </div>
//                             <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.description}</p>
//                             <div className="flex items-center justify-between mt-2">
//                               <span className="text-xs text-gray-500 dark:text-gray-500">{notification.time}</span>
//                               <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
//                                 View Details
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Footer */}
//                   <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
//                     <Link
//                       href="/partner/notifications"
//                       className="block text-center text-blue-600 hover:text-blue-700 font-medium py-2"
//                     >
//                       View All Notifications
//                     </Link>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Profile Dropdown */}
//             <div className="relative" ref={profileRef}>
//               <button
//                 onClick={() => setIsProfileOpen(!isProfileOpen)}
//                 className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
//               >
//                 <div className="relative">
//                   <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
//                     {partnerData.avatar ? (
//                       <Image
//                         src={partnerData.avatar}
//                         alt={partnerData.name}
//                         width={40}
//                         height={40}
//                         className="rounded-xl"
//                       />
//                     ) : (
//                       partnerData.name.charAt(0)
//                     )}
//                   </div>
//                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full border-2 border-white dark:border-gray-800"></div>
//                 </div>
                
//                 <div className="hidden lg:block text-left">
//                   <div className="font-semibold text-gray-800 dark:text-white">{partnerData.name}</div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
//                     <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
//                     {partnerData.plan} Partner
//                   </div>
//                 </div>
                
//                 <ChevronDown className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} size={18} />
//               </button>

//               {/* Profile Dropdown Menu */}
//               {isProfileOpen && (
//                 <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
//                   {/* Profile Summary */}
//                   <div className="p-4 border-b border-gray-100 dark:border-gray-700">
//                     <div className="flex items-center gap-3">
//                       <div className="relative">
//                         <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
//                           {partnerData.avatar ? (
//                             <Image
//                               src={partnerData.avatar}
//                               alt={partnerData.name}
//                               width={48}
//                               height={48}
//                               className="rounded-xl"
//                             />
//                           ) : (
//                             partnerData.name.charAt(0)
//                           )}
//                         </div>
//                         <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
//                           <Star className="text-white" size={10} />
//                         </div>
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-gray-800 dark:text-white">{partnerData.name}</h3>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">{partnerData.email}</p>
//                         <div className="flex items-center gap-2 mt-1">
//                           <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
//                             Rating: {partnerData.rating}/5
//                           </span>
//                           <span className="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
//                             {partnerData.plan}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Quick Stats */}
//                     <div className="grid grid-cols-2 gap-2 mt-4">
//                       <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
//                         <div className="text-xs text-gray-500 dark:text-gray-400">Earnings</div>
//                         <div className="font-bold text-gray-800 dark:text-white">₹2.5L</div>
//                       </div>
//                       <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
//                         <div className="text-xs text-gray-500 dark:text-gray-400">Bookings</div>
//                         <div className="font-bold text-gray-800 dark:text-white">24</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Quick Links */}
//                   <div className="p-2">
//                     {quickLinks.map((link) => (
//                       <Link
//                         key={link.label}
//                         href={link.href}
//                         className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
//                       >
//                         <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
//                           {link.icon}
//                         </div>
//                         <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
//                           {link.label}
//                         </span>
//                       </Link>
//                     ))}

//                     {/* Divider */}
//                     <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>

//                     {/* Wallet */}
//                     <button className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
//                       <div className="flex items-center gap-3">
//                         <Wallet className="text-gray-400 group-hover:text-emerald-600 transition-colors" size={18} />
//                         <span className="text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 transition-colors">
//                           Wallet Balance
//                         </span>
//                       </div>
//                       <span className="font-bold text-emerald-600">₹85,420</span>
//                     </button>
//                   </div>

//                   {/* Footer */}
//                   <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
//                     <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all font-medium">
//                       <LogOut size={18} />
//                       Sign Out
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile Search Bar (Hidden on desktop) */}
//         <div className="lg:hidden mt-4">
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Stats Bar */}
//       <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-800">
//         <div className="flex items-center justify-between overflow-x-auto">
//           <div className="flex items-center gap-6">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
//               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">All Systems Active</span>
//             </div>
//             <div className="hidden md:flex items-center gap-6 text-sm">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 <span className="text-gray-600 dark:text-gray-400">8 Active Bookings</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                 <span className="text-gray-600 dark:text-gray-400">3 Pending Requests</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
//                 <span className="text-gray-600 dark:text-gray-400">98% Response Rate</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button className="text-xs px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
//               <span className="hidden sm:inline">Last updated:</span> Just now
//             </button>
//             <button className="text-xs px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-md">
//               Refresh
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Search, Bell, HelpCircle, User, Settings, 
  LogOut, ChevronDown, Zap, Moon, Sun, Star,
  MessageSquare, Wallet, TrendingUp, Menu
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const notifications = [
  { id: 1, type: 'booking', title: 'New Booking Request', description: 'Mercedes S-Class for wedding', time: '2 min ago', read: false },
  { id: 2, type: 'payment', title: 'Payment Received', description: '₹25,000 from Aarav Sharma', time: '1 hour ago', read: false },
  { id: 3, type: 'rating', title: 'New 5-Star Rating', description: 'Excellent service!', time: '3 hours ago', read: true },
  { id: 4, type: 'alert', title: 'Vehicle Maintenance', description: 'BMW 7 Series needs service', time: '1 day ago', read: true },
];

const quickLinks = [
  { label: 'My Profile', href: '/partner/profile', icon: <User size={18} /> },
  { label: 'Account Settings', href: '/partner/settings', icon: <Settings size={18} /> },
  { label: 'Help Center', href: '/partner/help', icon: <HelpCircle size={18} /> },
  { label: 'Contact Support', href: '/partner/support', icon: <MessageSquare size={18} /> },
];

// Add interface for props
interface PartnerHeaderProps {
  onMobileMenuClick?: () => void;
}

export default function PartnerHeader({ onMobileMenuClick }: PartnerHeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark all as read
  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Partner data
  const partnerData = {
    name: 'Raj Luxury Cars',
    email: 'raj@luxurycars.com',
    plan: 'Premium',
    rating: 4.8,
    joinDate: '2023-06-15',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-800">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Search Bar */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            {/* Mobile Menu Button - Now uses the prop from layout */}
            <button 
              onClick={onMobileMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu size={24} />
            </button>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bookings, vehicles, customers..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* Search Suggestions */}
              {searchQuery && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">Quick Actions</div>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                      <Search size={16} />
                      Search "{searchQuery}" in bookings
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                      <TrendingUp size={16} />
                      View performance for "{searchQuery}"
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="text-amber-500" size={20} />
              ) : (
                <Moon className="text-gray-600 dark:text-gray-400" size={20} />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
              >
                <Bell className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800 dark:text-white">Notifications</h3>
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                        All
                      </button>
                      <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        Unread
                      </button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            notification.type === 'booking' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                            notification.type === 'payment' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                            notification.type === 'rating' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}>
                            {notification.type === 'booking' && '📅'}
                            {notification.type === 'payment' && '💰'}
                            {notification.type === 'rating' && '⭐'}
                            {notification.type === 'alert' && '⚠️'}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-gray-800 dark:text-white">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500 dark:text-gray-500">{notification.time}</span>
                              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                    <Link
                      href="/partner/notifications"
                      className="block text-center text-blue-600 hover:text-blue-700 font-medium py-2"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {partnerData.avatar ? (
                      <Image
                        src={partnerData.avatar}
                        alt={partnerData.name}
                        width={40}
                        height={40}
                        className="rounded-xl"
                      />
                    ) : (
                      partnerData.name.charAt(0)
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                
                <div className="hidden lg:block text-left">
                  <div className="font-semibold text-gray-800 dark:text-white">{partnerData.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    {partnerData.plan} Partner
                  </div>
                </div>
                
                <ChevronDown className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} size={18} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  {/* Profile Summary */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {partnerData.avatar ? (
                            <Image
                              src={partnerData.avatar}
                              alt={partnerData.name}
                              width={48}
                              height={48}
                              className="rounded-xl"
                            />
                          ) : (
                            partnerData.name.charAt(0)
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                          <Star className="text-white" size={10} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">{partnerData.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{partnerData.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                            Rating: {partnerData.rating}/5
                          </span>
                          <span className="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                            {partnerData.plan}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Earnings</div>
                        <div className="font-bold text-gray-800 dark:text-white">₹2.5L</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Bookings</div>
                        <div className="font-bold text-gray-800 dark:text-white">24</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="p-2">
                    {quickLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                      >
                        <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                          {link.icon}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                          {link.label}
                        </span>
                      </Link>
                    ))}

                    {/* Divider */}
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>

                    {/* Wallet */}
                    <button className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Wallet className="text-gray-400 group-hover:text-emerald-600 transition-colors" size={18} />
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 transition-colors">
                          Wallet Balance
                        </span>
                      </div>
                      <span className="font-bold text-emerald-600">₹85,420</span>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                    <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all font-medium">
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Hidden on desktop) */}
        <div className="lg:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">All Systems Active</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">8 Active Bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">3 Pending Requests</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">98% Response Rate</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="text-xs px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
              <span className="hidden sm:inline">Last updated:</span> Just now
            </button>
            <button className="text-xs px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-md">
              Refresh
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
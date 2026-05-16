import DashboardStats from '@/app/components/partner/DashboardStats';
import RecentBookings from '@/app/components/partner/RecentBookings';
import QuickActions from '@/app/components/partner/QuickActions';
import PerformanceChart from '@/app/components/partner/PerformanceChart';
import { useAuth } from '@/app/contexts/AuthContext';

// export default function PartnerDashboard() {
//   return (
//     <div className="space-y-6">
//       {/* Welcome Banner */}
//       <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
//         <h1 className="text-3xl font-bold">Welcome back, Premium Partner! 🎉</h1>
//         <p className="text-purple-100 mt-2">Manage your luxury fleet and grow your business</p>
//       </div>

//       {/* Stats Cards */}
//       <DashboardStats />

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Performance Chart */}
//           <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-blue-800">Performance Analytics</h2>
//               <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
//                 This Month
//               </span>
//             </div>
//             <PerformanceChart />
//           </div>

//           {/* Recent Bookings */}
//           <RecentBookings />
//         </div>

//         {/* Right Column */}
//         <div className="space-y-6">
//           {/* Quick Actions */}
//           <QuickActions />

//           {/* Earnings Summary */}
//           <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 shadow-lg border border-emerald-100">
//             <h2 className="text-2xl font-bold text-emerald-800 mb-4">Earnings Summary</h2>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
//                 <span className="text-emerald-700 font-medium">Available Balance</span>
//                 <span className="text-2xl font-bold text-emerald-800">₹85,420</span>
//               </div>
//               <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
//                 <span className="text-blue-700 font-medium">This Month</span>
//                 <span className="text-xl font-bold text-blue-800">₹42,150</span>
//               </div>
//               <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg">
//                 Request Payout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function PartnerDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'Premium Partner'}! 🎉</h1>
        <p className="text-purple-100 mt-2">Manage your luxury fleet and grow your business</p>
      </div>
      </div>
  );
}
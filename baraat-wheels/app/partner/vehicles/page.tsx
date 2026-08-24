//app/partner/vehicles/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  Grid, List, Filter, Download, Plus, 
  Search, MoreVertical, Eye, Edit, Trash2,
  TrendingUp, Star, Calendar, IndianRupee,Car,
  ChevronLeft, ChevronRight, Sparkles, AlertCircle
} from 'lucide-react';
import { vehicleApi } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';
import axios from 'axios';

const vehiclesData = [
  {
    id: 1,
    vehicle_name: 'Mercedes S-Class 2024',
    type: 'luxury',
    category: 'Luxury Sedan',
    price: '₹25,000/day',
    bookings: 24,
    rating: 4.9,
    status: 'active',
    lastBooking: 'Today, 2:00 PM',
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=200&fit=crop',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    vehicle_name: 'Royal Elephant Decorated',
    type: 'royal',
    category: 'Royal Procession',
    price: '₹45,000/day',
    bookings: 18,
    rating: 4.8,
    status: 'active',
    lastBooking: 'Tomorrow, 10:00 AM',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&h=200&fit=crop',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 3,
    vehicle_name: 'Traditional Ghodi Set',
    type: 'ghodi',
    category: 'Traditional',
    price: '₹15,000/day',
    bookings: 32,
    rating: 4.7,
    status: 'maintenance',
    lastBooking: '2 days ago',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=200&fit=crop',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 4,
    vehicle_name: 'BMW 7 Series Luxury',
    type: 'luxury',
    category: 'Luxury Sedan',
    price: '₹22,000/day',
    bookings: 15,
    rating: 4.8,
    status: 'active',
    lastBooking: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=400&h=200&fit=crop',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 5,
    vehicle_name: 'Audi A8 L Chauffeur',
    type: 'luxury',
    category: 'Executive',
    price: '₹28,000/day',
    bookings: 12,
    rating: 4.9,
    status: 'active',
    lastBooking: 'Today, 9:00 AM',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=200&fit=crop',
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 6,
    vehicle_name: 'Vintage Rolls Royce',
    type: 'royal',
    category: 'Vintage',
    price: '₹55,000/day',
    bookings: 8,
    rating: 4.9,
    status: 'unavailable',
    lastBooking: '1 week ago',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=200&fit=crop',
    color: 'from-rose-500 to-red-500',
  },
];

export default function MyVehiclesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken } = useAuth();

  const [vehicles, setVehicles] = useState<any[]>(vehiclesData); // In real implementation, define proper type  

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle?.vehicle_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle?.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || vehicle?.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || vehicle?.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return { text: 'Active', color: 'bg-emerald-100 text-emerald-700', icon: '🟢' };
      case 'maintenance':
        return { text: 'Maintenance', color: 'bg-amber-100 text-amber-700', icon: '🛠️' };
      case 'unavailable':
        return { text: 'Unavailable', color: 'bg-red-100 text-red-700', icon: '⛔' };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-700', icon: '❓' };
    }
  };

  // Fetch vehicles from server
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAccessToken() || "";
      if (!token) {
        console.error('No access token found. Please log in.');
        setLoading(false);
        return;
      } 
      const response = await vehicleApi.getVehiclesWithStats(token, { page: currentPage, limit: itemsPerPage });
      setVehicles(response?.data.vehicles || []); // In real implementation, this should update state
      console.log('Fetched vehicles with stats:', response);
      // In real implementation, set vehicles state with response data here
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

 const formatRelativeDate = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();
  
  // Reset times to midnight for day comparisons
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffMs = today.getTime() - inputDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Format time: 09:00 AM
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const timeStr = `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
  
  // Today
  if (diffDays === 0) {
    return `Today ${timeStr}`;
  }
  
  // Yesterday (older than today but within 2 days)
  if (diffDays === 1) {
    return `Yesterday ${timeStr}`;
  }
  
  // 2-6 days ago
  if (diffDays >= 2 && diffDays < 7) {
    return `${diffDays} days ago`;
  }
  
  // 7-29 days ago → weeks
  if (diffDays >= 7 && diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  
  // 30-364 days ago → months
  if (diffDays >= 30 && diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  
  // 365+ days ago → years
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Vehicles
          </h1>
          <p className="text-gray-600 mt-2">Manage your luxury fleet and maximize earnings</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/partner/vehicles/add"
            className="btn-primary flex items-center gap-2 px-6 py-3"
          >
            <Plus size={20} />
            Add Vehicle
          </Link>
          
          <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <Download className="text-gray-600" size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vehicles</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">24</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
              <Sparkles size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-600 flex items-center gap-1">
            <TrendingUp size={16} />
            +12% from last month
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Vehicles</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">18</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
              <Calendar size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-600">75% availability</div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Rating</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">4.8</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white">
              <Star size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-600">98% positive reviews</div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">₹4.2L</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white">
              <IndianRupee size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-600 flex items-center gap-1">
            <TrendingUp size={16} />
            +28% from last month
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicles by name, category..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="luxury">Luxury Vehicles</option>
              <option value="ghodi">Ghodi</option>
              <option value="royal">Royal Vehicles</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="unavailable">Unavailable</option>
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Grid size={20} className={viewMode === 'grid' ? 'text-blue-600' : 'text-gray-600'} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <List size={20} className={viewMode === 'list' ? 'text-blue-600' : 'text-gray-600'} />
              </button>
            </div>

            <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
              <Filter className="text-gray-600" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedVehicles.map((vehicle) => {
            const statusBadge = getStatusBadge(vehicle.status);
            return (
              <div
                key={vehicle.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url(${vehicle?.images || '/default-image.jpg'})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${vehicle.color} bg-gradient-to-r`}>
                      {vehicle.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                      {statusBadge.icon} {statusBadge.text}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-2xl font-bold text-white">{vehicle.basePricePerHour}/hr</div>
                    <div className="text-sm text-white/90">{vehicle.vehicleName}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="fill-yellow-400 text-yellow-400" size={16} />
                      <span className="font-medium">{vehicle.stats?.rating || 4.5}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">Model Year</div>
                      <span className="font-medium">{vehicle.modelYear || 2026}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">Extra Km Rate</div>
                      <span className="font-medium">{vehicle.extraKmRate || 1000} / Km</span>
                    </div>
                  </div>
                    
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Total Bookings</div>
                      <div className="text-md font-bold text-gray-600">{vehicle.stats?.totalBookings || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Last Booked</div>
                      <div className="text-md font-bold text-gray-600">{vehicle.stats?.lastBooking && (() => {
                          return formatRelativeDate(vehicle.stats.lastBooking);
                        })() || formatRelativeDate('2026-05-19T08:15:00.000Z')}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-2">
                      <Eye size={16} />
                      View
                    </button>
                    <button className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2">
                      <Edit size={16} />
                      Edit
                    </button>
                    <button className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Vehicle</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Bookings</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Rating</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedVehicles.map((vehicle) => {
                const statusBadge = getStatusBadge(vehicle.status);
                return (
                  <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${vehicle.color} bg-gradient-to-r`}>
                          {/* Vehicle icon based on type */}
                          
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{vehicle.vehicleName}</div>
                          <div className="text-sm text-gray-500">{vehicle.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {vehicle.vehicleType}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-800">{vehicle.basePricePerHour}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-blue-500" size={16} />
                        <span>{vehicle.stats?.totalBookings || 2}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Star className="fill-yellow-400 text-yellow-400" size={16} />
                        <span>{vehicle.stats?.rating || 4.3}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredVehicles.length)}-
            {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} of {filteredVehicles.length} vehicles
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg border ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredVehicles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Car className="text-gray-400" size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No vehicles found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? `No vehicles match your search "${searchQuery}". Try different keywords.`
              : 'You haven\'t added any vehicles yet. Start by adding your first vehicle!'}
          </p>
          <Link
            href="/partner/vehicles/add"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Add Your First Vehicle
          </Link>
        </div>
      )}
    </div>
  );
}
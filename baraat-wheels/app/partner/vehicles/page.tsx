//app/partner/vehicles/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  Grid, List, Filter, Download, Plus, 
  Search, MoreVertical, Eye, Edit, Trash2,
  TrendingUp, Star, Calendar, IndianRupee, Car,
  ChevronLeft, ChevronRight, Sparkles, AlertCircle
} from 'lucide-react';
import { vehicleApi } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';
import axios from 'axios';

// Define proper types for your vehicle data
interface Vehicle {
  _id: string;
  vehicleName: string;
  vehicleType: string;
  company: string;
  description: string;
  basePricePerHour: number;
  extraHourRate: string;
  extraKmRate: string;
  modelYear: number;
  seatingCapacity: number;
  color: string;
  status: string;
  isActive: boolean;
  images: string[];
  thumbnail: string;
  features: string[];
  gstPercent: number;
  insuranceNumber: string;
  rcNumber: string;
  pucNumber: string;
  location: {
    city: string[];
    state: string;
    pincode: string | null;
  };
  stats: {
    rating: number;
    totalBookings: number;
  };
  documents: {
    insurance: { url: string; verified: boolean };
    rc: { url: string; verified: boolean };
    puc: { url: string; verified: boolean };
  };
  ownerId: any;
  createdAt: string;
  updatedAt: string;
  category?: string;
  partnerId?: string;
}

// API Response interface
interface ApiResponse {
  count: number;
  vehicles: Vehicle[];
}

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

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);


  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return { text: 'Active', color: 'bg-emerald-100 text-emerald-700', icon: '🟢' };
      case 'pending':
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' };
      case 'maintenance':
        return { text: 'Maintenance', color: 'bg-amber-100 text-amber-700', icon: '🛠️' };
      case 'unavailable':
        return { text: 'Unavailable', color: 'bg-red-100 text-red-700', icon: '⛔' };
      default:
        return { text: status || 'Unknown', color: 'bg-gray-100 text-gray-700', icon: '❓' };
    }
  };

  const getVehicleTypeClass = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'royal': 'from-purple-500 to-pink-500',
      'luxury': 'from-blue-500 to-cyan-500',
      'car': 'from-gray-700 to-gray-900',
      'suv': 'from-emerald-500 to-teal-600',
      'muv': 'from-amber-500 to-orange-500',
      'vintage': 'from-rose-500 to-red-500',
      'luxury sedan': 'from-indigo-500 to-purple-500',
      'luxury suv': 'from-purple-600 to-indigo-600'
    };
    return typeMap[type?.toLowerCase()] || 'from-gray-500 to-gray-600';
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
      
      const response = await vehicleApi.getAll();
      console.log('API response:', response.data);
      // Handle the response based on your API structure
      if (response?.data && Array.isArray(response.data)) {
          setVehicles(response.data);
          setTotalCount(response.data.length || 0);
      } else {
          console.error('Unexpected API response structure:', response);
          setError('Unexpected response from server. Please try again later.');
      }     
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles. Please try again later.');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [getAccessToken, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Stats calculations
  const totalActive = vehicles.filter(v => v.status === 'active').length;
  const totalPending = vehicles.filter(v => v.status === 'pending').length;
  const avgRating = vehicles.length > 0 
    ? (vehicles.reduce((acc, v) => acc + (v.stats?.rating || 0), 0) / vehicles.length).toFixed(1)
    : '0';
  const totalBookings = vehicles.reduce((acc, v) => acc + (v.stats?.totalBookings || 0), 0);
  
  // Calculate monthly revenue (estimated based on base price and bookings)
  const monthlyRevenue = vehicles.reduce((acc, v) => {
    // Assuming each booking is ~4 hours on average
    const estimatedEarnings = (v.stats?.totalBookings || 0) * v.basePricePerHour * 4;
    return acc + estimatedEarnings;
  }, 0);



  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle?.vehicleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle?.vehicleType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle?.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || vehicle?.vehicleType?.toLowerCase() === selectedType.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || vehicle?.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatRelativeDate = (isoString: string) => {
    if (!isoString) return 'Never';
    
    try {
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
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getVehicleImage = (vehicle: Vehicle) => {
    if (vehicle.thumbnail) {
      const img = vehicle.thumbnail ? vehicle.thumbnail : '/default-vehicle.jpg';
      vehicle.images[0] = `http://localhost:5000${img}`;
      return `http://localhost:5000${img}`;
    }
    if (vehicle.images && vehicle.images.length > 0) {
      const img = vehicle.images[0] && vehicle.images.length > 0 ? vehicle.images[0] : '/default-vehicle.jpg';
      vehicle.images[0] = `http://localhost:5000${img}`;
      return vehicle.images[0];
    }       
    return '/default-vehicle.jpg';
  };

  const getVehicleCategory = (vehicle: Vehicle) => {
    return vehicle.category || vehicle.vehicleType || 'Vehicle';
  };

  const getVehicleLocation = (vehicle: Vehicle) => {
    if (vehicle.location) {
      if (Array.isArray(vehicle.location.city) && vehicle.location.city.length > 0) {
        return vehicle.location.city[0] || vehicle.location.state || 'Location not specified';
      }
      return vehicle.location.state || 'Location not specified';
    }
    return 'Location not specified';
  };

  if (isLoading && isInitialLoad) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your vehicles...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center text-red-500">
        <AlertCircle size={48} className="mx-auto mb-4" />
        <p>{error}</p>
        <button 
          onClick={fetchVehicles}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );

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
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalCount || vehicles.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
              <Sparkles size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-600 flex items-center gap-1">
            <TrendingUp size={16} />
            {vehicles.length > 0 ? `${Math.round((totalActive / vehicles.length) * 100)}% active` : 'No vehicles yet'}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Vehicles</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalActive}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
              <Calendar size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-600">
            {vehicles.length > 0 ? `${Math.round((totalActive / vehicles.length) * 100)}% availability` : 'No vehicles'}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Rating</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{avgRating}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white">
              <Star size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-600">
            {vehicles.length > 0 ? `${totalBookings} total bookings` : 'No bookings yet'}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estimated Revenue</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">₹{(monthlyRevenue / 1000).toFixed(1)}K</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white">
              <IndianRupee size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-600 flex items-center gap-1">
            <TrendingUp size={16} />
            Based on {totalBookings} bookings
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
              placeholder="Search by name, company, type..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="royal">Royal</option>
              <option value="luxury">Luxury</option>
              <option value="car">Car</option>
              <option value="suv">SUV</option>
              <option value="muv">MUV</option>
              <option value="vintage">Vintage</option>
              <option value="luxury sedan">Luxury Sedan</option>
              <option value="luxury suv">Luxury SUV</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
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
            const typeClass = getVehicleTypeClass(vehicle.vehicleType);
            return (
              <div
                key={vehicle._id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url(${getVehicleImage(vehicle)})` }}
                    // style={{ backgroundImage: `url(${vehicle.images[0]})` }}

                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${typeClass}`}>
                      {getVehicleCategory(vehicle)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                      {statusBadge.icon} {statusBadge.text}
                    </span>
                  </div>

                  {/* Price and Name */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-2xl font-bold text-white">₹{vehicle.basePricePerHour}/hr</div>
                    <div className="text-sm text-white/90">{vehicle.vehicleName}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="fill-yellow-400 text-yellow-400" size={16} />
                      <span className="font-medium">{vehicle.stats?.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">Model</div>
                      <span className="font-medium">{vehicle.modelYear || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">Company</div>
                      <span className="font-medium">{vehicle.company || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">Seats</div>
                      <span className="font-medium">{vehicle.seatingCapacity || 5}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">Location</div>
                      <span className="font-medium text-sm truncate max-w-[100px]">
                        {getVehicleLocation(vehicle)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">Extra/Km</div>
                      <span className="font-medium">₹{vehicle.extraKmRate || 'N/A'}</span>
                    </div>
                  </div>
                    
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Total Bookings</div>
                      <div className="text-md font-bold text-gray-600">{vehicle.stats?.totalBookings || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Added</div>
                      <div className="text-md font-bold text-gray-600">
                        {formatRelativeDate(vehicle.createdAt)}
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
        <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Vehicle</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Price/hr</th>
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
                  <tr key={vehicle._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg bg-cover bg-center"
                          style={{ backgroundImage: `url(${getVehicleImage(vehicle)})` }}
                        />
                        <div>
                          <div className="font-medium text-gray-800">{vehicle.vehicleName}</div>
                          <div className="text-sm text-gray-500">{vehicle.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {vehicle.vehicleType || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-800">₹{vehicle.basePricePerHour}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-blue-500" size={16} />
                        <span>{vehicle.stats?.totalBookings || 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Star className="fill-yellow-400 text-yellow-400" size={16} />
                        <span>{vehicle.stats?.rating?.toFixed(1) || '0.0'}</span>
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
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-200 flex-wrap gap-4">
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
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg border ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
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
      {filteredVehicles.length === 0 && !isLoading && !isInitialLoad && (
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



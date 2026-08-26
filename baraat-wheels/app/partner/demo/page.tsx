
// components/BookingList.jsx

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import BookingCard from './BookingCard';
import axios from 'axios';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

const BookingList = () => {
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateRange: { start: '', end: '' }
  });

  // Fetch bookings data with comprehensive error handling
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles/partner/booking-stats/432557', {
        timeout: 10000,
      });

      console.log('Fetched bookings data:', response.data);

      // Normalize response data safely
      let bookingsData: any[] = [];
      if (Array.isArray(response.data)) {
        bookingsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        bookingsData = response.data.data;
      } else if (response.data && Array.isArray(response.data.bookings)) {
        bookingsData = response.data.bookings;
      } else if (response.data && typeof response.data === 'object') {
        bookingsData = Object.values(response.data).filter(item => typeof item === 'object' && item !== null);
      }

      setAllBookings(bookingsData);
      setFilteredBookings(bookingsData);
    } catch (err: any) {
      console.error('Error fetching bookings data:', err);
      let errorMessage = 'Failed to fetch bookings data. Please try again.';

      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Server responded with an error status code
          errorMessage = err.response.data?.message || `Server Error: ${err.response.status} ${err.response.statusText}`;
        } else if (err.request) {
          // Request was made but no response was received (e.g. backend server offline / network error)
          errorMessage = 'Unable to connect to the server (localhost:5000). Please ensure the backend server is running.';
        } else {
          // Error in setting up the request
          errorMessage = err.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setAllBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Apply filters
  useEffect(() => {
    let result = [...allBookings];

    if (filters.status) {
      result = result.filter(booking => 
        booking.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(booking =>
        booking.customer?.name?.toLowerCase().includes(searchTerm) ||
        booking.vehicle?.vehicleName?.toLowerCase().includes(searchTerm) ||
        booking._id?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.dateRange.start) {
      result = result.filter(booking => 
        booking.timeline?.createdAt && new Date(booking.timeline.createdAt) >= new Date(filters.dateRange.start)
      );
    }
    if (filters.dateRange.end) {
      result = result.filter(booking => 
        booking.timeline?.createdAt && new Date(booking.timeline.createdAt) <= new Date(filters.dateRange.end)
      );
    }

    setFilteredBookings(result);
    setCurrentPage(1);
  }, [filters, allBookings]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'startDate' || name === 'endDate') {
      setFilters(prev => ({
        ...prev,
        dateRange: { ...prev.dateRange, [name === 'startDate' ? 'start' : 'end']: value }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      search: '',
      dateRange: { start: '', end: '' }
    });
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Bookings
          <span className="text-sm font-normal text-gray-500 ml-3">
            ({filteredBookings.length} bookings)
          </span>
        </h2>
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap mb-6 p-4 bg-gray-50 rounded-xl items-center">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm min-w-[130px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Started">Started</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input
          type="text"
          name="search"
          placeholder="Search bookings..."
          value={filters.search}
          onChange={handleFilterChange}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="date"
          name="startDate"
          value={filters.dateRange.start}
          onChange={handleFilterChange}
          className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="date"
          name="endDate"
          value={filters.dateRange.end}
          onChange={handleFilterChange}
          className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={resetFilters}
          className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading bookings data...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-6 mb-6 bg-red-50 border border-red-200 rounded-2xl">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-base font-semibold text-red-800">Error Loading Bookings</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <button
                onClick={fetchBookings}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookings List (Max 2 cards visible in view, scrollable when exceeding) */}
      {!loading && !error && currentItems.length > 0 && (
        <div className="max-h-[780px] overflow-y-auto overflow-x-hidden p-1 pr-3 sm:pr-4 space-y-6 rounded-2xl scroll-smooth transition-all [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent]">
          {currentItems.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && !error && filteredBookings.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-5xl mb-3">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-default' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === index + 1
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-default'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingList;

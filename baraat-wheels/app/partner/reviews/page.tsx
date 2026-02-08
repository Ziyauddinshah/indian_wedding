'use client';

import { useState, useEffect } from 'react';
import { 
  Star, Filter, MessageSquare, ThumbsUp, Flag, 
  Calendar, User, Car, MapPin, Clock, CheckCircle,
  TrendingUp, Award, Sparkles, MoreVertical, Reply,
  ChevronDown, ChevronUp, Eye, Download, RefreshCw,
  Search, StarHalf, AlertCircle, CheckSquare, XCircle,
  TrendingDown, Heart, Award as AwardIcon, Zap,
  IndianRupee, BarChart3, PieChart, Target, Crown,Trophy
} from 'lucide-react';

const reviewsData = {
  summary: {
    averageRating: 4.8,
    totalReviews: 142,
    fiveStar: 115,
    fourStar: 22,
    threeStar: 3,
    twoStar: 1,
    oneStar: 1,
    responseRate: '98%',
    avgResponseTime: '4.2 hours',
    ranking: 'Top 10%',
  },
  reviews: [
    {
      id: 1,
      customer: {
        name: 'Aarav Sharma',
        avatar: 'AS',
        bookings: 3,
        memberSince: '2023',
      },
      vehicle: 'Mercedes S-Class 2024',
      bookingId: 'BK-2024-001',
      date: '2 days ago',
      rating: 5,
      title: 'Excellent Service! Luxury at its best',
      comment: 'The Mercedes S-Class was absolutely stunning. Clean, comfortable, and the chauffeur was very professional. Made our wedding day extra special. Highly recommended!',
      response: {
        text: 'Thank you, Aarav! We\'re thrilled to hear that our service made your special day even better. Looking forward to serving you again!',
        date: '1 day ago',
      },
      likes: 12,
      verified: true,
      tags: ['Luxury', 'Professional', 'Wedding'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 2,
      customer: {
        name: 'Priya Patel',
        avatar: 'PP',
        bookings: 1,
        memberSince: '2024',
      },
      vehicle: 'Royal Elephant Decorated',
      bookingId: 'BK-2024-002',
      date: '1 week ago',
      rating: 4,
      title: 'Beautiful experience for our festival',
      comment: 'The royal elephant was magnificent and perfectly decorated. The handler was experienced. Slightly delayed pickup but overall great experience.',
      response: null,
      likes: 8,
      verified: true,
      tags: ['Royal', 'Festival', 'Traditional'],
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 3,
      customer: {
        name: 'Rohan Mehta',
        avatar: 'RM',
        bookings: 2,
        memberSince: '2023',
      },
      vehicle: 'BMW 7 Series Luxury',
      bookingId: 'BK-2024-003',
      date: '2 weeks ago',
      rating: 5,
      title: 'Perfect for corporate events',
      comment: 'Used the BMW for our corporate guests. Extremely professional service, timely, and the vehicle was in pristine condition. Will definitely book again!',
      response: {
        text: 'Thank you for your kind words, Rohan! We pride ourselves on punctuality and professionalism for corporate clients.',
        date: '2 weeks ago',
      },
      likes: 15,
      verified: true,
      tags: ['Corporate', 'Professional', 'Punctual'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 4,
      customer: {
        name: 'Neha Gupta',
        avatar: 'NG',
        bookings: 1,
        memberSince: '2024',
      },
      vehicle: 'Traditional Ghodi',
      bookingId: 'BK-2024-004',
      date: '3 weeks ago',
      rating: 3,
      title: 'Good but room for improvement',
      comment: 'The ghodi was beautiful but seemed tired. Decoration was good but could be better. Service was average.',
      response: {
        text: 'Thank you for your honest feedback, Neha. We\'ve noted your concerns and will improve our ghodi care and decoration standards.',
        date: '3 weeks ago',
      },
      likes: 3,
      verified: false,
      tags: ['Traditional', 'Wedding'],
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 5,
      customer: {
        name: 'Vikram Singh',
        avatar: 'VS',
        bookings: 4,
        memberSince: '2022',
      },
      vehicle: 'Audi A8 L Chauffeur',
      bookingId: 'BK-2024-005',
      date: '1 month ago',
      rating: 5,
      title: 'Best luxury car service in town!',
      comment: 'Fourth time booking with them. Consistent excellence every time. The Audi was spotless, chauffeur was courteous, and service was flawless.',
      response: {
        text: 'Vikram, we\'re honored to have you as a repeat customer! Your loyalty means the world to us. Thank you for the continued trust!',
        date: '1 month ago',
      },
      likes: 24,
      verified: true,
      tags: ['Luxury', 'Repeat Customer', 'Excellent'],
      color: 'from-gray-700 to-gray-900',
    },
    {
      id: 6,
      customer: {
        name: 'Ananya Reddy',
        avatar: 'AR',
        bookings: 1,
        memberSince: '2024',
      },
      vehicle: 'Vintage Rolls Royce',
      bookingId: 'BK-2024-006',
      date: '2 months ago',
      rating: 1,
      title: 'Very disappointing experience',
      comment: 'Vehicle broke down during the event. No backup provided. Ruined our special day. Very poor service.',
      response: {
        text: 'We sincerely apologize for the inconvenience caused, Ananya. We\'ve taken immediate action and will be providing a full refund along with a complimentary service.',
        date: '2 months ago',
      },
      likes: 1,
      verified: true,
      tags: ['Issue', 'Breakdown'],
      color: 'from-red-500 to-pink-600',
    },
  ],
  ratingsDistribution: [
    { stars: 5, count: 115, percentage: 81 },
    { stars: 4, count: 22, percentage: 15 },
    { stars: 3, count: 3, percentage: 2 },
    { stars: 2, count: 1, percentage: 1 },
    { stars: 1, count: 1, percentage: 1 },
  ],
  vehicleRatings: [
    { vehicle: 'Mercedes S-Class', rating: 4.9, reviews: 45, color: 'from-purple-500 to-pink-500' },
    { vehicle: 'Royal Elephant', rating: 4.8, reviews: 28, color: 'from-emerald-500 to-teal-600' },
    { vehicle: 'BMW 7 Series', rating: 4.8, reviews: 32, color: 'from-blue-500 to-cyan-500' },
    { vehicle: 'Traditional Ghodi', rating: 4.2, reviews: 25, color: 'from-amber-500 to-orange-500' },
    { vehicle: 'Audi A8 L', rating: 4.9, reviews: 12, color: 'from-gray-700 to-gray-900' },
  ],
  reviewInsights: [
    { keyword: 'Professional', count: 89, sentiment: 'positive', trend: '+12%' },
    { keyword: 'Luxury', count: 76, sentiment: 'positive', trend: '+8%' },
    { keyword: 'Punctual', count: 54, sentiment: 'positive', trend: '+15%' },
    { keyword: 'Clean', count: 42, sentiment: 'positive', trend: '+5%' },
    { keyword: 'Comfortable', count: 38, sentiment: 'positive', trend: '+3%' },
    { keyword: 'Delayed', count: 12, sentiment: 'negative', trend: '-2%' },
    { keyword: 'Issue', count: 8, sentiment: 'negative', trend: '-1%' },
    { keyword: 'Average', count: 5, sentiment: 'negative', trend: '-3%' },
  ],
};

const ratingFilters = [
  { id: 'all', label: 'All Reviews' },
  { id: '5', label: '5 Stars', icon: '⭐⭐⭐⭐⭐' },
  { id: '4', label: '4 Stars', icon: '⭐⭐⭐⭐' },
  { id: '3', label: '3 Stars', icon: '⭐⭐⭐' },
  { id: '2', label: '2 Stars', icon: '⭐⭐' },
  { id: '1', label: '1 Star', icon: '⭐' },
  { id: 'unresponded', label: 'Needs Response' },
];

const sortOptions = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'highest', label: 'Highest Rated' },
  { id: 'lowest', label: 'Lowest Rated' },
  { id: 'most_liked', label: 'Most Helpful' },
];

export default function PartnerReviews() {
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResponseModal, setShowResponseModal] = useState<number | null>(null);
  const [responseText, setResponseText] = useState('');
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(true);

  // Filter and sort reviews
  const filteredReviews = reviewsData.reviews.filter(review => {
    const matchesRating = selectedRating === 'all' || 
      (selectedRating === 'unresponded' ? !review.response : review.rating.toString() === selectedRating);
    const matchesSearch = searchQuery === '' || 
      review.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVehicle = !selectedVehicle || review.vehicle === selectedVehicle;
    
    return matchesRating && matchesSearch && matchesVehicle;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'most_liked':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  // Calculate response rate
  const respondedReviews = reviewsData.reviews.filter(r => r.response).length;
  const responseRate = Math.round((respondedReviews / reviewsData.reviews.length) * 100);

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < Math.floor(rating) 
                ? 'fill-yellow-400 text-yellow-400' 
                : i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 font-bold text-gray-800">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Get sentiment color
  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return 'bg-emerald-100 text-emerald-700';
      case 'negative': return 'bg-red-100 text-red-700';
      case 'neutral': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Handle review response
  const handleResponseSubmit = (reviewId: number) => {
    if (!responseText.trim()) return;
    
    // In a real app, you would send this to your backend
    console.log(`Response to review ${reviewId}:`, responseText);
    
    // Simulate successful response
    alert('Response submitted successfully!');
    setResponseText('');
    setShowResponseModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
              <Star className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Customer Reviews
              </h1>
              <p className="text-gray-600 mt-2">Manage reviews, respond to feedback, and improve your service</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <Download className="text-gray-600" size={20} />
          </button>
          <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <RefreshCw className="text-gray-600" size={20} />
          </button>
          <button className="btn-primary flex items-center gap-2 px-6 py-3">
            <Sparkles size={20} />
            Request Reviews
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Average Rating */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-bold text-gray-800">{reviewsData.summary.averageRating}</p>
                <span className="text-gray-500">/5</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="text-emerald-500" size={16} />
                <span className="text-sm text-emerald-600">+0.2 this month</span>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white">
              <Award size={24} />
            </div>
          </div>
        </div>

        {/* Total Reviews */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{reviewsData.summary.totalReviews}</p>
              <div className="text-sm text-gray-500 mt-2">Across all vehicles</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
              <MessageSquare size={24} />
            </div>
          </div>
        </div>

        {/* Response Rate */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Rate</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{responseRate}%</p>
              <div className="flex items-center gap-2 mt-2">
                <Clock size={14} className="text-gray-500" />
                <span className="text-sm text-gray-500">Avg. {reviewsData.summary.avgResponseTime}</span>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        {/* Ranking */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Your Ranking</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{reviewsData.summary.ranking}</p>
              <div className="flex items-center gap-2 mt-2">
                <Crown className="text-yellow-500" size={16} />
                <span className="text-sm text-emerald-600">Top performer</span>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
              <Trophy size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters & Controls */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reviews by customer, vehicle, or comment..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <BarChart3 size={20} className={viewMode === 'list' ? 'text-blue-600' : 'text-gray-600'} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <PieChart size={20} className={viewMode === 'grid' ? 'text-blue-600' : 'text-gray-600'} />
                  </button>
                </div>

                <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
                  <Filter className="text-gray-600" size={20} />
                </button>
              </div>
            </div>

            {/* Rating Filters */}
            <div className="flex flex-wrap gap-2 mt-6">
              {ratingFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedRating(filter.id)}
                  className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    selectedRating === filter.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.icon && <span>{filter.icon}</span>}
                  {filter.label}
                  {filter.id !== 'all' && filter.id !== 'unresponded' && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedRating === filter.id ? 'bg-white/20' : 'bg-gray-300'
                    }`}>
                      {reviewsData.summary[`${filter.id}Star` as keyof typeof reviewsData.summary]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Vehicle Filters */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Filter by Vehicle:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    !selectedVehicle
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Vehicles
                </button>
                {reviewsData.vehicleRatings.map((vehicle) => (
                  <button
                    key={vehicle.vehicle}
                    onClick={() => setSelectedVehicle(vehicle.vehicle)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      selectedVehicle === vehicle.vehicle
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {vehicle.vehicle}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <MessageSquare className="text-gray-400" size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No reviews found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery 
                    ? `No reviews match your search "${searchQuery}". Try different keywords.`
                    : 'No reviews match your selected filters.'}
                </p>
                <button 
                  onClick={() => {
                    setSelectedRating('all');
                    setSearchQuery('');
                    setSelectedVehicle(null);
                  }}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <RefreshCw size={20} />
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  {/* Review Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${review.color} flex items-center justify-center text-white font-bold`}>
                          {review.customer.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-bold text-gray-800">{review.customer.name}</h3>
                            {review.verified && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full flex items-center gap-1">
                                <CheckCircle size={10} />
                                Verified
                              </span>
                            )}
                            <span className="text-gray-500">• {review.customer.bookings} bookings</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {review.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Car size={14} />
                              {review.vehicle}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {review.bookingId}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {renderStars(review.rating)}
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="text-gray-500" size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{review.title}</h4>
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {review.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                          <ThumbsUp size={16} />
                          <span className="text-sm">Helpful ({review.likes})</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-red-600">
                          <Flag size={16} />
                          <span className="text-sm">Report</span>
                        </button>
                        <button 
                          onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                        >
                          {expandedReview === review.id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                          <span className="text-sm">Details</span>
                        </button>
                      </div>
                      
                      <div>
                        {!review.response ? (
                          <button
                            onClick={() => setShowResponseModal(review.id)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-md font-medium flex items-center gap-2"
                          >
                            <Reply size={16} />
                            Respond
                          </button>
                        ) : (
                          <span className="text-sm text-emerald-600 flex items-center gap-1">
                            <CheckCircle size={14} />
                            Responded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Response (if exists) */}
                    {review.response && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                            You
                          </div>
                          <span className="font-medium text-gray-800">Your Response</span>
                          <span className="text-sm text-gray-500">• {review.response.date}</span>
                        </div>
                        <p className="text-gray-700">{review.response.text}</p>
                        <button 
                          onClick={() => {
                            setResponseText(review.response?.text || '');
                            setShowResponseModal(review.id);
                          }}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          Edit response
                        </button>
                      </div>
                    )}

                    {/* Expanded Details */}
                    {expandedReview === review.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-bold text-gray-800 mb-3">Review Details</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Customer Since</p>
                            <p className="font-medium">{review.customer.memberSince}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Booking Type</p>
                            <p className="font-medium">
                              {review.tags.includes('Wedding') ? 'Wedding' :
                               review.tags.includes('Corporate') ? 'Corporate' :
                               review.tags.includes('Festival') ? 'Festival' : 'General'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Vehicle Type</p>
                            <p className="font-medium">
                              {review.vehicle.includes('Mercedes') || review.vehicle.includes('BMW') || review.vehicle.includes('Audi') 
                                ? 'Luxury' : 
                               review.vehicle.includes('Elephant') 
                                ? 'Royal' : 
                               review.vehicle.includes('Ghodi') 
                                ? 'Traditional' : 'Special'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Sentiment</p>
                            <p className={`font-medium ${
                              review.rating >= 4 ? 'text-emerald-600' :
                              review.rating >= 3 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {review.rating >= 4 ? 'Positive' :
                               review.rating >= 3 ? 'Neutral' : 'Negative'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Analytics & Insights */}
        <div className="space-y-6">
          {/* Rating Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Rating Distribution</h2>
                <p className="text-gray-600">Breakdown by star ratings</p>
              </div>
            </div>

            <div className="space-y-4">
              {reviewsData.ratingsDistribution.map((rating) => (
                <div key={rating.stars} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating.stars 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{rating.stars} stars</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-800">{rating.count}</span>
                      <span className="text-sm text-gray-500 ml-1">({rating.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        rating.stars === 5 ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
                        rating.stars === 4 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        rating.stars === 3 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                        rating.stars === 2 ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                        'bg-gradient-to-r from-gray-500 to-gray-700'
                      }`}
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">81%</div>
                  <div className="text-sm text-gray-600">5-Star Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">2%</div>
                  <div className="text-sm text-gray-600">Below 3 Stars</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Ratings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Vehicle Ratings</h2>
            <div className="space-y-4">
              {reviewsData.vehicleRatings.map((vehicle) => (
                <div key={vehicle.vehicle} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${vehicle.color} flex items-center justify-center text-white`}>
                        {vehicle.vehicle.includes('Mercedes') && '🏎️'}
                        {vehicle.vehicle.includes('Royal') && '👑'}
                        {vehicle.vehicle.includes('BMW') && '🚗'}
                        {vehicle.vehicle.includes('Ghodi') && '🐎'}
                        {vehicle.vehicle.includes('Audi') && '🚙'}
                      </div>
                      <span className="font-medium text-gray-800">{vehicle.vehicle}</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="fill-yellow-400 text-yellow-400" size={14} />
                        <span className="font-bold">{vehicle.rating}</span>
                      </div>
                      <div className="text-sm text-gray-500">{vehicle.reviews} reviews</div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${vehicle.color}`}
                      style={{ width: `${(vehicle.rating / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Insights */}
          {showInsights && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-purple-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Review Insights</h2>
                </div>
                <button 
                  onClick={() => setShowInsights(false)}
                  className="p-1 hover:bg-white/50 rounded-lg"
                >
                  <XCircle className="text-gray-400" size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {reviewsData.reviewInsights.slice(0, 6).map((insight, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(insight.sentiment)}`}>
                        {insight.sentiment.charAt(0).toUpperCase() + insight.sentiment.slice(1)}
                      </span>
                      <span className="font-medium text-gray-800">{insight.keyword}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">{insight.count}</span>
                      <span className={`text-xs font-medium ${
                        insight.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {insight.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-purple-200">
                <h4 className="font-bold text-gray-800 mb-2">💡 Key Takeaway</h4>
                <p className="text-sm text-gray-700">
                  Customers frequently mention "Professional" (89 times). Continue emphasizing professional
                  service in your marketing and training.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowResponseModal(null)} />
            
            <div className="relative bg-white rounded-2xl w-full max-w-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Reply className="text-blue-600" size={24} />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Respond to Review</h3>
                      <p className="text-gray-600">Your response will be public</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowResponseModal(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Original Review */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                      {reviewsData.reviews.find(r => r.id === showResponseModal)?.customer.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {reviewsData.reviews.find(r => r.id === showResponseModal)?.customer.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {reviewsData.reviews.find(r => r.id === showResponseModal)?.date}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "{reviewsData.reviews.find(r => r.id === showResponseModal)?.comment}"
                  </p>
                </div>

                {/* Response Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Response
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Write your response here..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Keep it professional and courteous. Respond within 48 hours for best results.
                    </p>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-medium text-blue-800 mb-2">💡 Response Tips</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Thank the customer for their feedback</li>
                      <li>• Address specific concerns mentioned</li>
                      <li>• Be professional and courteous</li>
                      <li>• Offer solutions if applicable</li>
                      <li>• Keep it concise and to the point</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResponseModal(null)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleResponseSubmit(showResponseModal)}
                    disabled={!responseText.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
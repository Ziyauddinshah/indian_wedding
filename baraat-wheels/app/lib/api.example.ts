// ─────────────────────────────────────────────
//  BARAAT WHEELS — API Usage Examples
//  Place these snippets in your page/component files
// ─────────────────────────────────────────────

import {
  authApi,
  vehicleApi,
  bookingApi,
  partnerApi,
  adminApi,
  uploadFile,
  getApiError,
} from '@/app/lib/api';


// ══════════════════════════════════════════════
//  AUTH EXAMPLES
// ══════════════════════════════════════════════

// ── Login ──────────────────────────────────────
async function loginExample() {
  try {
    const res = await authApi.login({
      email: 'ziya@example.com',
      password: 'password123',
    });

    const { user, token } = res.data;
    console.log('Logged in as:', user.name, '| Role:', user.role);
    // token is set as HTTP-only cookie by the server automatically
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Register ───────────────────────────────────
async function registerExample() {
  try {
    const res = await authApi.register({
      name: 'Ziyauddin Shah',
      email: 'ziya@baratwheels.com',
      password: 'securepass',
      phone: '9876543210',
      role: 'partner',                // 'customer' or 'partner'
    });

    console.log('Registered:', res.data.user);
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Get current logged-in user ─────────────────
async function getMeExample() {
  try {
    const res = await authApi.getMe();
    console.log('Current user:', res.data.user);
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Logout ─────────────────────────────────────
async function logoutExample() {
  try {
    await authApi.logout();
    window.location.href = '/login';  // clear UI after logout
  } catch (error) {
    console.error(getApiError(error));
  }
}


// ══════════════════════════════════════════════
//  VEHICLE EXAMPLES
// ══════════════════════════════════════════════

// ── Get all vehicles (with filters) ────────────
async function getVehiclesExample() {
  try {
    const res = await vehicleApi.getAll({
      type: 'SUV',
      minPrice: 1000,
      maxPrice: 5000,
      seats: 7,
      available: true,
      page: 1,
      limit: 10,
    });

    const { vehicles, total, pages } = res.data;
    console.log(`${total} vehicles found across ${pages} pages`);
    vehicles.forEach((v: any) => console.log(`${v.name} — ₹${v.pricePerDay}/day`));
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Get single vehicle ──────────────────────────
async function getVehicleByIdExample(vehicleId: string) {
  try {
    const res = await vehicleApi.getById(vehicleId);
    console.log('Vehicle:', res.data.vehicle);
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Register a new vehicle (partner) ───────────
//   Used in /partner/vehicles/register page
async function registerVehicleExample(
  imageFiles: File[],
  setProgress: (p: number) => void
) {
  try {
    const formData = new FormData();
    formData.append('name',         'Innova Crysta');
    formData.append('type',         'SUV');
    formData.append('brand',        'Toyota');
    formData.append('model',        'Crysta');
    formData.append('year',         '2022');
    formData.append('pricePerDay',  '2500');
    formData.append('seats',        '7');
    formData.append('fuel',         'Diesel');
    formData.append('transmission', 'manual');

    // Append all selected image files
    imageFiles.forEach(file => formData.append('images', file));

    const res = await vehicleApi.register(formData);
    console.log('Vehicle registered:', res.data.vehicle._id);
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Get partner's own vehicles ──────────────────
async function getMyVehiclesExample() {
  try {
    const res = await vehicleApi.getMyVehicles();
    console.log('My vehicles:', res.data.vehicles);
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Toggle availability ─────────────────────────
async function toggleAvailabilityExample(vehicleId: string) {
  try {
    const res = await vehicleApi.toggleAvailability(vehicleId);
    const { isAvailable } = res.data.vehicle;
    console.log(`Vehicle is now ${isAvailable ? 'available' : 'unavailable'}`);
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Update vehicle ──────────────────────────────
async function updateVehicleExample(vehicleId: string) {
  try {
    const res = await vehicleApi.update(vehicleId, {
      pricePerDay: 3000,
      isAvailable: true,
    });
    console.log('Updated:', res.data.vehicle);
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Delete vehicle ──────────────────────────────
async function deleteVehicleExample(vehicleId: string) {
  try {
    await vehicleApi.delete(vehicleId);
    console.log('Vehicle deleted');
  } catch (error) {
    console.error(getApiError(error));
  }
}


// ══════════════════════════════════════════════
//  BOOKING EXAMPLES
// ══════════════════════════════════════════════

// ── Create booking (customer) ───────────────────
async function createBookingExample() {
  try {
    const res = await bookingApi.create({
      vehicleId:       '64abc123def456',
      startDate:       '2026-05-01',
      endDate:         '2026-05-05',
      pickupLocation:  'Varanasi Airport',
      dropoffLocation: 'Varanasi Railway Station',
    });

    const { booking } = res.data;
    console.log(`Booking created! ID: ${booking._id}`);
    console.log(`Total: ₹${booking.totalAmount} for ${booking.totalDays} days`);
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Get my bookings (customer) ──────────────────
async function getMyBookingsExample() {
  try {
    const res = await bookingApi.getMyBookings();
    const { bookings } = res.data;

    bookings.forEach(b => {
      console.log(`${b._id} | Status: ${b.status} | ₹${b.totalAmount}`);
    });
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Get partner's bookings ──────────────────────
async function getPartnerBookingsExample() {
  try {
    const res = await bookingApi.getPartnerBookings();
    console.log('Partner bookings:', res.data.bookings);
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Update booking status (admin/partner) ───────
async function updateBookingStatusExample(bookingId: string) {
  try {
    const res = await bookingApi.updateStatus(bookingId, 'confirmed');
    console.log('Booking confirmed:', res.data.booking);
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Cancel booking ──────────────────────────────
async function cancelBookingExample(bookingId: string) {
  try {
    const res = await bookingApi.cancel(bookingId);
    console.log('Booking cancelled:', res.data.booking);
  } catch (error) {
    console.error(getApiError(error));
  }
}


// ══════════════════════════════════════════════
//  PARTNER EXAMPLES
// ══════════════════════════════════════════════

// ── Admin: Get all partners ─────────────────────
async function getAllPartnersExample() {
  try {
    const res = await partnerApi.getAll();
    const pending = res.data.partners.filter(p => !p.isApproved);
    console.log(`${pending.length} partners awaiting approval`);
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Admin: Approve / reject partner ────────────
async function approvePartnerExample(partnerId: string) {
  try {
    await partnerApi.approve(partnerId);
    console.log('Partner approved!');
  } catch (error) {
    console.error(getApiError(error));
  }
}

// ── Partner: Upload documents ───────────────────
async function uploadPartnerDocumentsExample(docFiles: File[]) {
  try {
    const formData = new FormData();
    docFiles.forEach(file => formData.append('documents', file));

    await partnerApi.uploadDocuments(formData);
    console.log('Documents uploaded successfully');
  } catch (error) {
    console.error(getApiError(error));
  }
}


// ══════════════════════════════════════════════
//  ADMIN EXAMPLES
// ══════════════════════════════════════════════

// ── Dashboard stats ─────────────────────────────
async function getDashboardStatsExample() {
  try {
    const res = await adminApi.getStats();
    const stats = res.data;

    console.log(`Users: ${stats.totalUsers}`);
    console.log(`Vehicles: ${stats.totalVehicles}`);
    console.log(`Bookings: ${stats.totalBookings}`);
    console.log(`Revenue: ₹${stats.totalRevenue}`);
    console.log(`Pending partners: ${stats.pendingPartners}`);
  } catch (error) {
    console.error(getApiError(error));
  }
}


// ══════════════════════════════════════════════
//  FILE UPLOAD WITH PROGRESS EXAMPLE
// ══════════════════════════════════════════════

// ── Upload images with progress bar ────────────
//   Call this from an <input type="file"> onChange
async function uploadWithProgressExample(files: File[]) {
  let progress = 0;

  try {
    await uploadFile(
      '/vehicles/register',
      files,
      (percent:any) => {
        progress = percent;
        console.log(`Upload progress: ${percent}%`);
        // In React: setUploadProgress(percent)
      }
    );
    console.log('All files uploaded!');
  } catch (error) {
    console.error(getApiError(error));
  }
}


// ══════════════════════════════════════════════
//  REACT COMPONENT EXAMPLE
//  How to use inside a Next.js page with useState
// ══════════════════════════════════════════════

/*
'use client';
import { useState, useEffect } from 'react';
import { vehicleApi, getApiError, Vehicle } from '@/lib/api';

export default function VehiclesPage() {
  const [vehicles, setVehicles]   = useState<Vehicle[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await vehicleApi.getAll({ available: true });
        setVehicles(res.data.vehicles);
      } catch (err) {
        setError(getApiError(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading vehicles...</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {vehicles.map(vehicle => (
        <div key={vehicle._id}>
          <h2>{vehicle.name}</h2>
          <p>₹{vehicle.pricePerDay}/day</p>
        </div>
      ))}
    </div>
  );
}
*/
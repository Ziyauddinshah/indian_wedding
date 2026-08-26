// components/BookingRequestsPage.tsx
'use client';
import { useState } from "react";

type BookingStatus = "pending" | "confirmed" | "rejected";

type BookingRequest = {
  id: number;
  renterName: string;
  vehicleName: string;
  pickupLocation: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: BookingStatus;
  rejectionReason?: string;
};

const initialRequests: BookingRequest[] = [
  {
    id: 1,
    renterName: "Maya Chen",
    vehicleName: "2023 Volvo XC40",
    pickupLocation: "SFO Terminal 2",
    startDate: "2026-09-10",
    endDate: "2026-09-13",
    totalAmount: 312.4,
    status: "pending",
  },
  {
    id: 2,
    renterName: "Elliot Brooks",
    vehicleName: "2022 Tesla Model 3",
    pickupLocation: "Oakland Jack London Square",
    startDate: "2026-09-15",
    endDate: "2026-09-17",
    totalAmount: 188.75,
    status: "pending",
  },
];

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

export default function BookingRequestsPage() {
  const [requests, setRequests] =
    useState<BookingRequest[]>(initialRequests);

  const [selectedRequest, setSelectedRequest] =
    useState<BookingRequest | null>(null);

  const [rejectingRequestId, setRejectingRequestId] =
    useState<number | null>(null);

  const [rejectionReason, setRejectionReason] = useState("");

  const confirmBooking = (requestId: number) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId
          ? { ...request, status: "confirmed" }
          : request,
      ),
    );
  };

  const openRejectForm = (requestId: number) => {
    setRejectingRequestId(requestId);
    setRejectionReason("");
  };

  const cancelReject = () => {
    setRejectingRequestId(null);
    setRejectionReason("");
  };

  const rejectBooking = (requestId: number) => {
    if (!rejectionReason.trim()) {
      return;
    }

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: "rejected",
              rejectionReason: rejectionReason.trim(),
            }
          : request,
      ),
    );

    cancelReject();
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Vehicle owner dashboard
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Booking requests
          </h1>

          <p className="mt-2 text-slate-600">
            Review requests and decide which bookings to accept.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              No booking requests
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              New requests will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {requests.map((request) => (
              <article
                key={request.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="border-b border-slate-100 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-950">
                        {request.renterName}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Booking request #{request.id}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyles[request.status]}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="mt-6 rounded-xl bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900">
                      {request.vehicleName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Requested vehicle
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Trip dates
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {request.startDate} - {request.endDate}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Pickup location
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {request.pickupLocation}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Owner payout
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-950">
                        ${request.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Current status
                      </p>

                      <p className="mt-1 font-medium capitalize text-slate-800">
                        {request.status}
                      </p>
                    </div>
                  </div>

                  {request.rejectionReason && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                        Rejection reason
                      </p>

                      <p className="mt-1 text-sm text-red-800">
                        {request.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>

                {rejectingRequestId === request.id && (
                  <div className="border-b border-slate-100 bg-red-50 p-6">
                    <label
                      htmlFor={`reason-${request.id}`}
                      className="block text-sm font-semibold text-red-900"
                    >
                      Rejection reason
                    </label>

                    <textarea
                      id={`reason-${request.id}`}
                      value={rejectionReason}
                      onChange={(event) =>
                        setRejectionReason(event.target.value)
                      }
                      placeholder="Explain why you cannot accept this request"
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    />

                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={cancelReject}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => rejectBooking(request.id)}
                        disabled={!rejectionReason.trim()}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Confirm rejection
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(request)}
                    className="text-left text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                  >
                    View details
                  </button>

                  {request.status === "pending" && (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => openRejectForm(request.id)}
                        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={() => confirmBooking(request.id)}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      >
                        Confirm booking
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-blue-600">
                    Booking details
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-950">
                    {selectedRequest.renterName}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="rounded-lg px-3 py-1 text-2xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close details"
                >
                  &times;
                </button>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <p>
                  <span className="font-semibold text-slate-500">Vehicle:</span>{" "}
                  {selectedRequest.vehicleName}
                </p>

                <p>
                  <span className="font-semibold text-slate-500">
                    Trip dates:
                  </span>{" "}
                  {selectedRequest.startDate} - {selectedRequest.endDate}
                </p>

                <p>
                  <span className="font-semibold text-slate-500">
                    Pickup:
                  </span>{" "}
                  {selectedRequest.pickupLocation}
                </p>

                <p>
                  <span className="font-semibold text-slate-500">
                    Payout:
                  </span>{" "}
                  ${selectedRequest.totalAmount.toFixed(2)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="mt-8 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Close details
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
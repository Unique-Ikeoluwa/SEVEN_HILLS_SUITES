"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

interface Booking {
  id: number;
  check_in: string;
  check_out: string;
  total_price: string;
  booking_status: string;
  payment_status: string;
  apartment: { title: string; location: string; description: string };
}

export function MyBookingsPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    try {
      const res = await api.get("/bookings/my-bookings");
      if (res.data?.success) setBookings(res.data.data);
    } catch (err) {
      console.error("Failed to load personal booking list payload:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyBookings(); }, []);

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking reservation?")) return;
    try {
      await api.post(`/bookings/${id}/cancel`);
      fetchMyBookings();
    } catch (err) {
      alert("Cancellation request failed.");
    }
  };

  if (loading) return <div className="text-center py-8 text-sm text-gray-400">Loading your bookings...</div>;
  if (bookings.length === 0) return <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">No reservations logged yet.</div>;

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className={`inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
              booking.booking_status === "confirmed" ? "bg-green-50 text-green-700" :
              booking.booking_status === "pending" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
            }`}>
              {booking.booking_status}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{booking.apartment.title}</h3>
            <p className="text-xs text-gray-400">{booking.apartment.location}</p>
            <p className="text-xs text-gray-500 pt-1">
              Timeline: <span className="font-semibold text-gray-700">{booking.check_in}</span> to <span className="font-semibold text-gray-700">{booking.check_out}</span>
            </p>
          </div>

          <div className="flex md:flex-col justify-between md:justify-end items-center md:items-end w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 gap-2">
            <div>
              <p className="text-xs text-gray-400 md:text-right">Total Paid:</p>
              <p className="text-lg font-extrabold text-gray-900">₦{parseFloat(booking.total_price).toLocaleString()}</p>
            </div>
            {booking.booking_status === "pending" && (
              <button
                onClick={() => handleCancel(booking.id)}
                className="text-xs font-semibold bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

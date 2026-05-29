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
  user: { fullName: string; email: string };
  apartment: { title: string; location: string };
}

export function BookingsTrackerPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/all-bookings");
      if (res.data?.success) setBookings(res.data.data);
    } catch (err) {
      console.error("Booking logs fetching error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to administratively cancel this reservation?")) return;
    try {
      await api.post(`/admin/bookings/${id}/cancel`);
      fetchBookings(); // Refresh data layout after status toggle
    } catch (err) { alert("Failed to cancel booking."); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("CRITICAL ACTION: Delete record completely from system history database?")) return;
    try {
      await api.delete(`/admin/bookings/${id}`);
      fetchBookings();
    } catch (err) { alert("Failed to delete booking."); }
  };

  if (loading) return <div className="py-10 text-center text-sm text-gray-500">Syncing reservation logs...</div>;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-400 font-medium border-b border-gray-100">
              <th className="p-4">Guest Info</th>
              <th className="p-4">Suite / Location</th>
              <th className="p-4">Timeline Dates</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <p className="text-gray-900 font-bold">{b.user.fullName}</p>
                  <p className="text-xs text-gray-400">{b.user.email}</p>
                </td>
                <td className="p-4">
                  <p className="text-gray-900">{b.apartment.title}</p>
                  <p className="text-xs text-gray-400">{b.apartment.location}</p>
                </td>
                <td className="p-4 text-xs space-y-0.5">
                  <p><span className="text-gray-400">In:</span> {b.check_in}</p>
                  <p><span className="text-gray-400">Out:</span> {b.check_out}</p>
                </td>
                <td className="p-4 text-gray-900">₦{parseFloat(b.total_price).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs rounded-full border font-bold ${
                    b.booking_status === "confirmed" ? "bg-green-50 text-green-700 border-green-100" :
                    b.booking_status === "pending" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-red-50 text-red-700 border-red-100"
                  }`}>{b.booking_status}</span>
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  {b.booking_status !== "cancelled" && (
                    <button onClick={() => handleCancel(b.id)} className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition-colors">Cancel</button>
                  )}
                  <button onClick={() => handleDelete(b.id)} className="text-xs bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    bookingId: number | null;
    status: "idle" | "submitting" | "success" | "error";
    message: string;
  }>({
    isOpen: false,
    bookingId: null,
    status: "idle",
    message: "",
  });

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

  useEffect(() => {
    fetchMyBookings();
  }, []);
  const openCancelConfirmation = (id: number) => {
    setModalState({
      isOpen: true,
      bookingId: id,
      status: "idle",
      message: "Are you sure you want to cancel this booking reservation? This action cannot be reversed.",
    });
  };

  const handleCancelExecute = async () => {
    if (!modalState.bookingId) return;

    setModalState((prev) => ({ ...prev, status: "submitting" }));
    try {
      await api.post(`/bookings/${modalState.bookingId}/cancel`);
      await fetchMyBookings(); 

      setModalState((prev) => ({
        ...prev,
        status: "success",
        message: "Your reservation has been cancelled successfully. Your statement updates automatically.",
      }));
      setTimeout(() => {
        closeModal();
      }, 3000);
    } catch (err) {
      setModalState((prev) => ({
        ...prev,
        status: "error",
        message: "Cancellation request failed. Please check your connection and try again.",
      }));
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, bookingId: null, status: "idle", message: "" });
  };

  if (loading) return <div className="text-center py-8 text-sm text-gray-400">Loading your bookings...</div>;
  if (bookings.length === 0) return <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">No reservations logged yet.</div>;

  return (
    <div className="space-y-4 relative">
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
                onClick={() => openCancelConfirmation(booking.id)}
                className="text-xs font-semibold bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      ))}

      {modalState.isOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center space-y-4 border border-gray-100 transform scale-100 transition-transform">
            
            {modalState.status === "idle" && (
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto">!</div>
            )}
            {modalState.status === "submitting" && (
              <div className="w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mx-auto" />
            )}
            {modalState.status === "success" && (
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto animate-bounce">✓</div>
            )}
            {modalState.status === "error" && (
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto">✕</div>
            )}

            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              {modalState.status === "idle" && "Confirm Cancellation"}
              {modalState.status === "submitting" && "Processing Request"}
              {modalState.status === "success" && "Reservation Cancelled"}
              {modalState.status === "error" && "Operation Blocked"}
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              {modalState.message}
            </p>
            {modalState.status === "idle" && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold py-3 rounded-xl transition-colors border"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancelExecute}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm shadow-red-100"
                >
                  Yes, Cancel
                </button>
              </div>
            )}

            {(modalState.status === "error" || modalState.status === "success") && (
              <button
                onClick={closeModal}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors pt-2"
              >
                Close Window
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

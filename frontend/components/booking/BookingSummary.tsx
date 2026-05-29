"use client";

import { useBookingStore } from "@/store/bookingStore";

export function BookingSummary() {
  const {
    nights,
    guests,
    basePrice,
    cleaningFee,
    serviceFee,
    total,
  } = useBookingStore();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Order Summary
      </h2>

      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">
            ₦{basePrice.toLocaleString()} × {nights} night(s)
          </span>

          <span className="font-medium text-gray-900">
            ₦{(basePrice * nights).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">
            Guests
          </span>

          <span className="font-medium text-gray-900">
            {guests}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">
            Cleaning Fee
          </span>

          <span className="font-medium text-gray-900">
            ₦{cleaningFee.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">
            Service Fee
          </span>

          <span className="font-medium text-gray-900">
            ₦{serviceFee.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 my-5" />

      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900">
          Total
        </span>

        <span className="text-2xl font-bold text-blue-600">
          ₦{total().toLocaleString()}
        </span>
      </div>
    </div>
  );
}
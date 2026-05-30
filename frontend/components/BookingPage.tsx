"use client";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { useParams } from "next/navigation";

export default function BookingPage() {
  const params = useParams()
  const apartmentIdString = (params?.id as string) || "";

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-5">
        <div className="mb-10">
          <p className="text-blue-600 font-semibold text-sm mb-2">
            Booking
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Complete Your Reservation
          </h1>

          <p className="text-gray-500 max-w-2xl">
            Secure your serviced apartment booking with flexible payment options including Naira and Cryptocurrency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
            <BookingForm apartmentId={apartmentIdString} />
            <BookingSummary />
        </div>
      </div>
    </main>
  );
}
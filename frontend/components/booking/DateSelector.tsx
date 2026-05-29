"use client";

import { useBookingStore } from "@/store/bookingStore";
import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import { BookingFormValues } from "@/schemas/bookingSchema";
import { useEffect } from "react";

interface DateSelectorProps {
  register: UseFormRegister<BookingFormValues>;
  watch: UseFormWatch<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
}

export function DateSelector({ register, watch, errors }: DateSelectorProps) {
  const { setNights } = useBookingStore();
  
  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  useEffect(() => {
    if (!checkIn || !checkOut) return;

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diff = endDate.getTime() - startDate.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (nights > 0) {
      setNights(nights);
    } else {
      setNights(0);
    }
  }, [checkIn, checkOut, setNights]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Select Dates</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-500">Check In</label>
          <input
            type="date"
            {...register("checkIn")}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none"
          />
          {errors.checkIn && <p className="text-sm text-red-500">{errors.checkIn.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-500">Check Out</label>
          <input
            type="date"
            {...register("checkOut")}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none"
          />
          {errors.checkOut && <p className="text-sm text-red-500">{errors.checkOut.message}</p>}
        </div>
      </div>
    </div>
  );
}

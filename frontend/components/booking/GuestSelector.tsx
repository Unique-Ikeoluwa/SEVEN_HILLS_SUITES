"use client";

import { useBookingStore } from "@/store/bookingStore";

interface GuestSelectorProps {
  value?: number;
  onChange?: (value: number) => void;
}

export function GuestSelector({
  value = 1,
  onChange,
}: GuestSelectorProps) {
  const { setGuests } = useBookingStore();

  function updateGuests(newValue: number) {
    if (newValue < 1) return;

    setGuests(newValue);

    onChange?.(newValue);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Guests
      </h2>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => updateGuests(value - 1)}
          className="w-10 h-10 rounded-full border border-gray-200 text-lg"
        >
          -
        </button>

        <span className="font-semibold text-lg">
          {value}
        </span>

        <button
          type="button"
          onClick={() => updateGuests(value + 1)}
          className="w-10 h-10 rounded-full border border-gray-200 text-lg"
        >
          +
        </button>
      </div>
    </div>
  );
}
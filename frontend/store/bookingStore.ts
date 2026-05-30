import { create } from "zustand";

type PaymentMethod = "naira" | "crypto";

interface BookingState {
  nights: number;
  guests: number;

  basePrice: number;
  cleaningFee: number;
  serviceFee: number;

  paymentMethod: PaymentMethod;

  setGuests: (guests: number) => void;
  setNights: (nights: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  
  setBasePrice: (price: number) => void;

  total: () => number;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  nights: 1,
  guests: 1,

  basePrice: 0,
  cleaningFee: 0,
  serviceFee: 0,

  paymentMethod: "naira",

  setGuests: (guests) => set({ guests }),

  setNights: (nights) => set({ nights }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setBasePrice: (price) => set({ basePrice: price }),

  total: () => {
    const { nights, basePrice, cleaningFee, serviceFee } = get();
    return nights * basePrice + cleaningFee + serviceFee;
  },
}));

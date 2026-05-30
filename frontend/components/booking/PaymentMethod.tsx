"use client";

import { useBookingStore } from "@/store/bookingStore";

interface PaymentMethodProps {
  value?: "naira" | "crypto";
  onChange?: (value: "naira" | "crypto") => void;
}

export function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  const { paymentMethod, setPaymentMethod } = useBookingStore();

  const activeMethod = value || paymentMethod;

  function handleMethodChange(method: "naira" | "crypto") {
    setPaymentMethod(method);
    onChange?.(method);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-5">
        Payment Method
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleMethodChange("naira")}
          className={`rounded-xl border p-4 text-left transition-colors ${
            activeMethod === "naira"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
          }`}
        >
          <p className="font-semibold text-gray-900 mb-1">
            Naira Payment
          </p>
          <p className="text-sm text-gray-500">
            Card, transfer, USSD
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleMethodChange("crypto")}
          className={`rounded-xl border p-4 text-left pointer-events-none transition-colors ${
            activeMethod === "crypto"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
          }`}
        >
          <p className="font-semibold text-gray-900 mb-1">
            Crypto Payment
          </p>
          <p className="text-sm text-gray-500">
            BTC, ETH, USDT
          </p>
        </button>
      </div>
    </div>
  );
}

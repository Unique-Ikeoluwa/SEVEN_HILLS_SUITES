"use client";

import { useState } from "react";
import { api } from "@/utils/api";

interface GatewayProps {
  bookingId: number;
  totalPrice: string;
  onPaymentComplete: () => void;
}

export function PaystackGateway({ bookingId, totalPrice }: GatewayProps) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handlePaystackRedirect = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.post("/payments/paystack/initialize", { bookingId });
      
      if (res.data?.success && res.data?.data?.authorization_url) {
        window.location.href = res.data.data.authorization_url;
      }
    } catch (error: any) {
      setErr(error.response?.data?.message || "Failed to initialize Paystack checkout stream.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm border-t-4 border-t-emerald-500 space-y-4 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Paystack Checkout Portal</h3>
          <p className="text-xs text-gray-400 mt-0.5">Reference Booking ID: #{bookingId}</p>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
          Secure Naira Channel
        </span>
      </div>

      {err && <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border text-center font-medium">{err}</div>}

      <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
        <p className="text-xs text-gray-400 font-medium">Amount Due</p>
        <p className="text-2xl font-extrabold text-gray-900">₦{parseFloat(totalPrice).toLocaleString()}</p>
      </div>

      <button 
        onClick={handlePaystackRedirect}
        disabled={loading}
        className="w-full bg-[#3bb75e] hover:bg-[#32a351] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting to Paystack...
          </>
        ) : (
          "Authorize Paystack Transaction"
        )}
      </button>
    </div>
  );
}

export function NowPaymentsGateway({ bookingId, totalPrice, onPaymentComplete }: GatewayProps) {
  return (
    <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm border-t-4 border-t-indigo-500 space-y-4 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-900">NowPayments Crypto Engine</h3>
          <p className="text-xs text-gray-400 mt-0.5">Reference Booking ID: #{bookingId}</p>
        </div>
        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-100">
          Crypto Gateway
        </span>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
        <p className="text-xs text-gray-400 font-medium">USD Equivalent Value (Rate: 1650)</p>
        <p className="text-2xl font-extrabold text-[#0057FF]">${(parseFloat(totalPrice) / 1650).toFixed(2)}</p>
      </div>

      <button 
        onClick={onPaymentComplete}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
      >
        Generate Crypto Wallet Address
      </button>
    </div>
  );
}

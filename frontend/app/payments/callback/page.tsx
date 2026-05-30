"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [msg, setMsg] = useState("Verifying payment transaction securely with your bank...");

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setStatus("error");
      setMsg("Missing transaction payment reference parameter pointer.");
      return;
    }

    async function verifyPaymentTransaction() {
      try {
        const res = await api.get(`/payments/paystack/verify?reference=${reference}`);
        
        if (res.data?.success) {
          setStatus("success");
          setMsg("Payment verified successfully! Redirecting to your dashboard...");
          
          setTimeout(() => {
            router.push("/profile?view=bookings");
          }, 2500);
        }
      } catch (err: any) {
        setStatus("error");
        setMsg(err.response?.data?.message || "Transaction authorization verification failed.");
      }
    }

    verifyPaymentTransaction();
  }, [searchParams, router]);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-5">
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-4">
        {status === "verifying" && (
          <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2" />
        )}
        
        {status === "success" && (
          <div className="w-12 h-12 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2 animate-bounce">
            ✓
          </div>
        )}

        {status === "error" && (
          <div className="w-12 h-12 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2">
            ✕
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          {status === "verifying" && "Transaction Validation"}
          {status === "success" && "Booking Secured!"}
          {status === "error" && "Checkout Blocked"}
        </h2>
        
        <p className="text-sm text-gray-500 leading-relaxed font-medium">
          {msg}
        </p>

        {status === "error" && (
          <button 
            onClick={() => router.push("/")}
            className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl text-sm pt-2"
          >
            Return to Explore
          </button>
        )}
      </div>
    </main>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const otpSchema = z.object({
  otpCode: z.string().length(6, "OTP code must be exactly 6 digits"),
});

type OtpValues = z.infer<typeof otpSchema>;

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otpCode: "" }
  });

  const onSubmit = async (data: OtpValues) => {
    setApiError(null);
    setSuccessMsg(null);
    try {
      await api.post("/auth/verify-otp", {
        email,
        otpCode: data.otpCode
      });
      router.push("/login?verified=true");
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Invalid OTP code configuration.");
    }
  };

  const handleResend = async () => {
    setResending(true);
    setApiError(null);
    setSuccessMsg(null);
    try {
      const res = await api.post("/auth/resend-otp", { email });
      setSuccessMsg(res.data.message || "A fresh OTP code has been sent!");
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Could not resend OTP code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Verify Your Account</h2>
          <p className="mt-2 text-sm text-gray-500">We sent a 6-digit verification code to <span className="font-semibold text-gray-900">{email}</span></p>
        </div>

        {apiError && <div className="p-3.5 text-sm bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-medium">{apiError}</div>}
        {successMsg && <div className="p-3.5 text-sm bg-green-50 border border-green-200 text-green-600 rounded-xl text-center font-medium">{successMsg}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>6-Digit Code</Label>
            <Input type="text" placeholder="123456" maxLength={6} className="text-center text-xl tracking-widest font-bold" {...register("otpCode")} />
            {errors.otpCode && <p className="text-xs text-red-500 font-medium">{errors.otpCode.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0057FF] hover:bg-[#0f53db] text-white py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-50 mt-2"
          >
            {isSubmitting ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Didn't receive a code?{" "}
          <button onClick={handleResend} disabled={resending} className="text-[#0057FF] font-semibold hover:underline disabled:opacity-50">
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </main>
  );
}

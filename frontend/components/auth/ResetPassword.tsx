"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const resetPasswordSchema = z.object({
  otpCode: z.string().length(6, "OTP code must be exactly 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [apiError, setApiError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otpCode: "", newPassword: "", confirmPassword: "" }
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setApiError(null);
    try {
      if (step === 1) {
        const res = await api.post("/auth/verify-reset-otp", {
          email,
          otpCode: data.otpCode
        });
        setResetToken(res.data.resetToken);
        setStep(2);
      } else {
        if (!resetToken) return;
        await api.post("/auth/reset-password", {
          resetToken,
          newPassword: data.newPassword
        });
        router.push("/login?verified=true");
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Verification phase failure.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {step === 1 ? "Verify Recovery OTP" : "Update Password"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {step === 1 ? `Enter the code sent to ${email}` : "Choose a new strong secure password below."}
          </p>
        </div>

        {apiError && <div className="p-3.5 text-sm bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-medium">{apiError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 ? (
            <div className="space-y-1.5">
              <Label>6-Digit Code</Label>
              <Input type="text" placeholder="123456" maxLength={6} className="text-center text-xl tracking-widest font-bold" {...register("otpCode")} />
              {errors.otpCode && <p className="text-xs text-red-500 font-medium">{errors.otpCode.message}</p>}
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" {...register("newPassword")} />
                {errors.newPassword && <p className="text-xs text-red-500 font-medium">{errors.newPassword.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0057FF] hover:bg-[#0f53db] text-white py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-50 mt-2"
          >
            {isSubmitting ? "Processing..." : step === 1 ? "Verify OTP Code" : "Save New Password"}
          </button>
        </form>
      </div>
    </main>
  );
}

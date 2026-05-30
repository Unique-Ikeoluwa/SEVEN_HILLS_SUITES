"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const redirectTarget = searchParams.get("redirect") || "/";

  const [apiError, setApiError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setVerificationSuccess(true);
    }
  }, [searchParams]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (data: LoginValues) => {
  setApiError(null);
  setVerificationSuccess(false);
  try {
    const res = await api.post("/auth/login", data);
    const { token, user } = res.data.data;

    setSession(user, token);
    if (user.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push(redirectTarget);
    }

  } catch (err: any) {
    setApiError(err.response?.data?.message || "Invalid email or password credentials.");
  }
};


  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500">Sign in to manage and secure your apartment bookings</p>
        </div>

        {verificationSuccess && <div className="p-3.5 text-sm bg-green-50 border border-green-200 text-green-600 rounded-xl text-center font-medium">Account verified successfully! You can now log in.</div>}
        {apiError && <div className="p-3.5 text-sm bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-medium">{apiError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email Address</Label>
            <Input type="email" placeholder="example@email.com" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label>Password</Label>
              <Link href="/forgot-password" className="text-xs font-semibold text-[#0057FF] hover:underline">Forgot password?</Link>
            </div>
            <Input type="password" placeholder="••••••••" {...register("password")} />
            {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0057FF] hover:bg-[#0f53db] text-white py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-50 mt-2"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#0057FF] font-semibold hover:underline">Register here</Link>
        </p>
        <div className="border-t border-gray-100 pt-4 text-center">
          <Link 
            href="/register-admin" 
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium"
          >
            Are you a staff member? Access Admin Portal
          </Link>
        </div>
      </div>
    </main>
  );
}

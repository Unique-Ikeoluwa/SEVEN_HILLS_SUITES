"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const adminRegisterSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone_no: z.string().min(10, "Phone number is too short"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AdminRegisterValues = z.infer<typeof adminRegisterSchema>;

export default function AdminRegister() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AdminRegisterValues>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: { fullName: "", email: "", phone_no: "", password: "", confirmPassword: "" }
  });

  const onSubmit = async (data: AdminRegisterValues) => {
    setApiError(null);
    try {
      const res = await api.post("/auth/register-admin", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone_no: data.phone_no
      });
      if (res.data?.data?.token) {
        setSession(res.data.data.user, res.data.data.token);
        router.push("/");
      } else {
        router.push("/login?verified=true");
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || "An unexpected admin registration error occurred.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full mb-2">
            Staff Portal
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Registration</h2>
          <p className="mt-2 text-sm text-gray-500">Create an administrator account to oversee apartment suites and bookings</p>
        </div>

        {apiError && <div className="p-3.5 text-sm bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-medium">{apiError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input type="text" placeholder="Admin Staff" {...register("fullName")} />
            {errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Email Address</Label>
            <Input type="email" placeholder="admin@sevenhills.com" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Phone Number</Label>
            <Input type="text" placeholder="+234800000000" {...register("phone_no")} />
            {errors.phone_no && <p className="text-xs text-red-500 font-medium">{errors.phone_no.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" placeholder="••••••••" {...register("password")} />
            {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Confirm Password</Label>
            <Input type="password" placeholder="••••••••" {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-50 mt-2"
          >
            {isSubmitting ? "Creating admin profile..." : "Register Admin"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Want to register as a standard guest instead?{" "}
          <Link href="/register" className="text-[#0057FF] font-semibold hover:underline">Click here</Link>
          </p>
      </div>
    </main>
  );
}

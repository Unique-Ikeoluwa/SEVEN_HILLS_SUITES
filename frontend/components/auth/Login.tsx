"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginGlobal = useAuthStore((state) => state.login);
  const redirectTarget = searchParams.get("redirect") || "/";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      loginGlobal({
        fullName: "Test User", 
        email: data.email 
      });

      router.push(redirectTarget);
    } catch (err) {
      console.error("Login failure event:", err);
    }
  };

  return (
    <main className="min-h-[calc(100-80px)] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500">Sign in to manage and secure your apartment bookings</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email Address</Label>
            <Input type="email" placeholder="example@email.com" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Password</Label>
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
          <Link href={`/register${searchParams.toString() ? '?' + searchParams.toString() : ''}`} className="text-[#0057FF] font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}

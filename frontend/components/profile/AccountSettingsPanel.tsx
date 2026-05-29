"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/utils/api";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const profileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phone_no: z.string().min(10, "Phone number is too short"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function AccountSettingsPanel() {
  const { user, setSession, token } = useAuthStore();
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: user?.fullName || "", phone_no: user?.phone_no || "" }
  });

  const onSubmit = async (data: ProfileValues) => {
    setStatusMsg(null);
    try {
      const res = await api.put("/auth/profile", data);
      if (res.data?.success && token) {
        setSession(res.data.data, token);
        setStatusMsg({ success: true, text: res.data.message || "Profile updated successfully!" });
      }
    } catch (err: any) {
      setStatusMsg({ success: false, text: err.response?.data?.message || "Failed to update profile parameters." });
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 shadow-sm max-w-xl">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Details</h2>

      {statusMsg && (
        <div className={`p-4 text-sm font-medium rounded-xl text-center mb-6 border ${
          statusMsg.success ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600"
        }`}>
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Full Name</Label>
          <Input type="text" {...register("fullName")} />
          {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Phone Number</Label>
          <Input type="text" {...register("phone_no")} />
          {errors.phone_no && <p className="text-xs text-red-500">{errors.phone_no.message}</p>}
        </div>

        <div className="space-y-1.5 opacity-60">
          <Label>Email Address (Immutable)</Label>
          <Input type="email" value={user?.email || ""} disabled className="bg-gray-50 cursor-not-allowed" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#0057FF] hover:bg-[#0f53db] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 pt-2"
        >
          {isSubmitting ? "Saving changes..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

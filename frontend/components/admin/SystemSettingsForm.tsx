"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const settingsSchema = z.object({
  usd_to_ngn_rate: z.number().positive("Exchange rate must be a positive number"),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export function SystemSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  const { register, handleSubmit, setValue, formState: { isSubmitting, errors } } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { usd_to_ngn_rate: 1650.00 }
  });
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.get("/admin/settings");
        if (res.data?.data?.usd_to_ngn_rate) {
          setValue("usd_to_ngn_rate", parseFloat(res.data.data.usd_to_ngn_rate));
        }
      } catch (err) {
        console.error("Failed to pull administrative system configurations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [setValue]);

  const onSubmit = async (data: SettingsValues) => {
    setStatusMsg(null);
    try {
      const res = await api.put("/admin/settings", data);
      setStatusMsg({
        success: true,
        text: res.data?.message || "Exchange rate updated globally successfully!"
      });
    } catch (err: any) {
      setStatusMsg({
        success: false,
        text: err.response?.data?.message || "Could not synchronize setting modifications."
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin mr-3" />
        <p className="text-sm text-gray-500 font-medium">Syncing currency configurations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Global System Parameters</h2>
      <p className="text-xs text-gray-500 mb-6">Configure cross-border baseline adjustments used for calculations across payment nodes.</p>

      {statusMsg && (
        <div className={`p-4 text-sm font-medium rounded-xl text-center mb-6 border ${
          statusMsg.success ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600"
        }`}>
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5 max-w-sm">
          <Label>USD to NGN Exchange Rate (₦)</Label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gray-400 text-sm font-semibold">₦</span>
            <Input 
              type="number" 
              step="0.01" 
              placeholder="1650.00" 
              className="pl-8 text-lg font-bold text-gray-800 tracking-wide"
              {...register("usd_to_ngn_rate", { valueAsNumber: true })} 
            />
          </div>
          {errors.usd_to_ngn_rate && <p className="text-xs text-red-500">{errors.usd_to_ngn_rate.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving Rates..." : "Apply Exchange Rate"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

interface StatsData {
  counters: { users: number; bookings: number; apartments: number };
  bookingsBreakdown: { pending: number; confirmed: number; cancelled: number };
  apartmentsBreakdown: { available: number; booked: number };
  revenue: { totalNGN: string; totalUSD: string };
}

export function AnalyticsPanel() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/admin/stats");
        if (res.data?.success) setStats(res.data.data);
      } catch (err) {
        console.error("Stats aggregation fallback tracking error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="py-10 text-center text-sm text-gray-500">Loading system metrics...</div>;
  if (!stats) return <div className="py-10 text-center text-sm text-red-500">Failed to pull database parameters.</div>;

  return (
    <div className="space-y-6">
      {/* Overview Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", val: stats.counters.bookings, color: "text-[#0057FF]" },
          { label: "Total Inventory", val: stats.counters.apartments, color: "text-gray-900" },
          { label: "Registered Accounts", val: stats.counters.users, color: "text-emerald-600" },
          { label: "Active Stays", val: stats.apartmentsBreakdown.booked, color: "text-amber-600" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
            <p className={`text-3xl font-extrabold mt-1 ${item.color}`}>{item.val}</p>
          </div>
        ))}
      </div>

      {/* Financial Split / Revenue */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
              <span className="text-sm text-gray-500 font-medium">Naira Vault (NGN)</span>
              <span className="text-lg font-bold text-gray-900">₦{parseFloat(stats.revenue.totalNGN).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
              <span className="text-sm text-gray-500 font-medium">Crypto/USD Vault (USD)</span>
              <span className="text-lg font-bold text-[#0057FF]">${parseFloat(stats.revenue.totalUSD).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Operational Flow States */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Reservation States</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl">
              <p className="font-semibold">Pending</p>
              <p className="text-lg font-bold mt-1">{stats.bookingsBreakdown.pending}</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl">
              <p className="font-semibold">Confirmed</p>
              <p className="text-lg font-bold mt-1">{stats.bookingsBreakdown.confirmed}</p>
            </div>
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl">
              <p className="font-semibold">Cancelled</p>
              <p className="text-lg font-bold mt-1">{stats.bookingsBreakdown.cancelled}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

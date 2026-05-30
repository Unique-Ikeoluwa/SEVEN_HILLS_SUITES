"use client"

import { useState } from "react";
import { CreateApartmentForm } from "./CreateApartmentForm";
import { SystemSettingsForm } from "./SystemSettingsForm";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { BookingsTrackerPanel } from "./BookingsTrackerPanel";
import { UsersManagementPanel } from "./UsersManagementPanel";

type TabOption = "analytics" | "bookings" | "upload" | "users" | "exchange";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabOption>("analytics");

    const tabsConfig: { id: TabOption; label: string }[] = [
        { id: "analytics", label: "Analytics Overview" },
        { id: "bookings", label: "Bookings Logs" },
        { id: "upload", label: "Upload Apartment" },
        { id: "users", label: "User Directory" },
        { id: "exchange", label: "Exchange Control" },
    ];
    
  return (
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="mb-8">
                <span className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full">
                    Enterprise Console
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-3">Admin Suite Hub</h1>
                <p className="text-gray-500 text-sm mt-1">Direct orchestration control vector matching for Seven Hills properties network.</p>
            </div>

            <div className="flex border-b border-gray-200 gap-4 md:gap-6 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
                {tabsConfig.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-sm font-semibold border-b-2 transition-all shrink-0 ${
                    activeTab === tab.id ? "border-amber-600 text-amber-600" : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                    {tab.label}
                </button>
                ))}
            </div>
            <div className="animate-fadeIn">
                {activeTab === "analytics" && <AnalyticsPanel />}
                {activeTab === "bookings" && <BookingsTrackerPanel />}
                {activeTab === "upload" && <CreateApartmentForm />}
                {activeTab === "users" && <UsersManagementPanel />}
                {activeTab === "exchange" && <SystemSettingsForm />}
            </div>
        </div>
      </main>
  );
}

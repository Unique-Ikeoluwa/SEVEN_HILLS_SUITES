"use client"

import { useState } from "react";
import { CreateApartmentForm } from "./CreateApartmentForm";
import { SystemSettingsForm } from "./SystemSettingsForm";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { BookingsTrackerPanel } from "./BookingsTrackerPanel";
import { UsersManagementPanel } from "./UsersManagementPanel";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

type TabOption = "analytics" | "bookings" | "upload" | "users" | "exchange";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabOption>("analytics");
    const [loggingOut, setLoggingOut] = useState(false);
    
    const logoutSession = useAuthStore((state) => state.logout);
    const router = useRouter();

    const tabsConfig: { id: TabOption; label: string }[] = [
        { id: "analytics", label: "Analytics Overview" },
        { id: "bookings", label: "Bookings Logs" },
        { id: "upload", label: "Upload Apartment" },
        { id: "users", label: "User Directory" },
        { id: "exchange", label: "Exchange Control" },
    ];

    const handleAdminLogout = async () => {
    setLoggingOut(true);
    try {
        await logoutSession();
        router.push("/");
    } catch (err: any) {
        console.error("Backend rejected logout parameters:", err);
        
        if (err.response?.status === 401) {
            useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
            const Cookies = (await import("js-cookie")).default;
            Cookies.remove("token");
            Cookies.remove("user");
            
            router.push("/");
        }
    } finally {
        setLoggingOut(false);
    }
};

    
  return (
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
                <div>
                    <span className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full">
                        Enterprise Console
                    </span>
                    <h1 className="text-3xl font-extrabold text-gray-900 mt-3">Admin Suite Hub</h1>
                    <p className="text-gray-500 text-sm mt-1">Direct orchestration control vector matching for Seven Hills properties network.</p>
                </div>

                <button
                    onClick={handleAdminLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white border border-gray-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-100 transition-colors shadow-sm disabled:opacity-50 group shrink-0 self-end sm:self-auto"
                >
                    <FiLogOut size={16} className="text-red-500 group-hover:translate-x-0.5 transition-transform" />
                    {loggingOut ? "Leaving Suite..." : "Logout"}
                </button>
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

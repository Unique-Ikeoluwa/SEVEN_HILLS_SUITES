"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { MyBookingsPanel } from "@/components/profile/MyBookingsPanel";
import { AccountSettingsPanel } from "@/components/profile/AccountSettingsPanel";
import { NotificationsPanel } from "@/components/profile/NotificationsPanel";

type ActiveView = "bookings" | "settings" | "notifications";

export default function Profile() {
  const [activeView, setActiveView] = useState<ActiveView>("bookings");
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[240px_1fr] gap-8 items-start">
            <aside className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-6">
              <div>
                <p className="text-gray-900 font-extrabold text-lg leading-tight truncate">{user?.fullName}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
              </div>

              <div className="flex flex-row lg:flex-col gap-1 border-b lg:border-none pb-4 lg:pb-0 overflow-x-auto whitespace-nowrap lg:whitespace-normal no-scrollbar">
                {[
                  { id: "bookings", label: "My Bookings" },
                  { id: "settings", label: "Profile Settings" },
                  { id: "notifications", label: "Notifications" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as ActiveView)}
                    className={`px-4 py-2.5 text-left text-sm font-semibold rounded-xl transition-all shrink-0 ${
                      activeView === item.id ? "bg-blue-50 text-[#0057FF]" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 text-left text-sm font-semibold rounded-xl text-red-500 hover:bg-red-50 transition-all shrink-0"
                >
                  Logout Session
                </button>
              </div>
            </aside>
            <section className="flex-1">
              {activeView === "bookings" && <MyBookingsPanel />}
              {activeView === "settings" && <AccountSettingsPanel />}
              {activeView === "notifications" && <NotificationsPanel />}
            </section>

          </div>
        </div>
      </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

interface NotificationItem {
  id: number;
  message: string;
  is_read: string;
  createdAt: string;
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      if (res.data?.success) setNotifications(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  const markSingleAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-center py-6 text-sm text-gray-400">Loading alerts...</div>;

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-500">Activity Stream</h3>
        {notifications.some(n => n.is_read === "false") && (
          <button onClick={markAllAsRead} className="text-xs font-semibold text-[#0057FF] hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">Inbox clear.</div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => n.is_read === "false" && markSingleAsRead(n.id)}
              className={`border p-4 rounded-xl transition-all relative flex justify-between items-start gap-4 ${
                n.is_read === "false" ? "bg-blue-50/40 border-blue-100 cursor-pointer hover:bg-blue-50" : "bg-white border-gray-100"
              }`}
            >
              <div className="space-y-1">
                <p className={`text-sm ${n.is_read === "false" ? "text-gray-900 font-semibold" : "text-gray-600 font-medium"}`}>
                  {n.message}
                </p>
                <p className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
              {n.is_read === "false" && <span className="w-2 h-2 shrink-0 rounded-full bg-[#0057FF] mt-1.5" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

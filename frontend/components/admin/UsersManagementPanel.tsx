"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone_no: string;
  role: string;
  is_active: boolean;
}

export function UsersManagementPanel() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      if (res.data?.success) setUsers(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleUserStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/admin/users/${id}`, { is_active: !currentStatus });
      fetchUsers(); // Refresh listings state payload
    } catch (err) { alert("Failed to modify access rules."); }
  };

  if (loading) return <div className="py-10 text-center text-sm text-gray-500">Accessing accounts repository...</div>;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-400 font-medium border-b border-gray-100">
              <th className="p-4">Name / Contact</th>
              <th className="p-4">System Role</th>
              <th className="p-4">Permissions State</th>
              <th className="p-4 text-right">Action Override</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <p className="text-gray-900 font-bold">{u.fullName}</p>
                  <p className="text-xs text-gray-400">{u.email} • {u.phone_no}</p>
                </td>
                <td className="p-4 uppercase tracking-wider text-xs font-bold text-gray-500">{u.role}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {u.is_active ? "Active" : "Suspended"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => toggleUserStatus(u.id, u.is_active)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                      u.is_active ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                    }`}
                  >
                    {u.is_active ? "Suspend Account" : "Activate Account"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

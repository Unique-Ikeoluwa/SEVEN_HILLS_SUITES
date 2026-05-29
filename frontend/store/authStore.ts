import { create } from "zustand";
import Cookies from "js-cookie";
import { api } from "@/utils/api";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone_no: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (user: User, token: string) => void;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setSession: (user, token) => {
    Cookies.set("token", token, { expires: 7 });
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Backend logout log error:", err);
    } finally {
      Cookies.remove("token");
      Cookies.remove("user");
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  initializeAuth: () => {
    const token = Cookies.get("token");
    const userStr = Cookies.get("user");

    if (token && userStr) {
      try {
        set({ user: JSON.parse(userStr), token, isAuthenticated: true });
      } catch {
        Cookies.remove("token");
        Cookies.remove("user");
      }
    }
  },
}));

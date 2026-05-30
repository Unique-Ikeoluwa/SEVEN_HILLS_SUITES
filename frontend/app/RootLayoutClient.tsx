"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SocketProvider } from "@/context/SocketContext";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <SocketProvider>
      <Topbar />
      <Navbar />

      <main>{children}</main>

      <Footer />
    </SocketProvider>
  );
}

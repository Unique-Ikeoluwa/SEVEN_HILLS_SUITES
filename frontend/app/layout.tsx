"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import "./globals.css";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SocketProvider } from "@/context/SocketContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <html lang="en">
      <body>
        <SocketProvider>
          <Topbar />
          <Navbar />

          <main>{children}</main>

          <Footer />
        </SocketProvider>
      </body>
    </html>
  );
}

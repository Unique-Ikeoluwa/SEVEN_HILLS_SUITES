"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, router, pathname]);

  if (isChecking) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0057FF] rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium text-sm animate-pulse">
          Verifying account session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

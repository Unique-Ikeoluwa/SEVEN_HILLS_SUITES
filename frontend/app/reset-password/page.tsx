import ResetPassword from "@/components/auth/ResetPassword";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-sm text-gray-400 font-medium">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0057FF] rounded-full animate-spin mb-3" />
          Loading Seven Hills Reset Password page...
        </div>
      }
    >
      <ResetPassword />
    </Suspense>
  );
}

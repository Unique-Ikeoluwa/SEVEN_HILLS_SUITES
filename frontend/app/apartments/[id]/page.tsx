import { Suspense } from "react";
import ApartmentDetailsPage from "@/components/ApartmentDetailsPage";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading...</div>}>
      <ApartmentDetailsPage />
    </Suspense>
  );
}
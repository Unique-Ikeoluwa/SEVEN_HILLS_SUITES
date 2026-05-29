import ApartmentDetailsPage from "@/components/ApartmentDetailsPage";
import { api } from "@/utils/api";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  let liveApartmentData = null;

  try {
    const res = await api.get(`/apartments/${resolvedParams.id}`);
    if (res.data?.success) {
      liveApartmentData = res.data.data;
    }
  } catch (err) {
    console.error("Single item parameter tracking resolution failure:", err);
  }
  if (!liveApartmentData) {
    notFound();
  }

  return (
    <ApartmentDetailsPage apartment={liveApartmentData} />
  );
}

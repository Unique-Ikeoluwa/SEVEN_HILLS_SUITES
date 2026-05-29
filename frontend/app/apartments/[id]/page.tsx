import ApartmentDetailsPage from "@/components/ApartmentDetailsPage";
import { ALL_APARTMENTS } from "@/data/apartments";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  
  const apartmentId = parseInt(resolvedParams.id, 10);

  const selectedApartment = ALL_APARTMENTS.find((apt) => apt.id === apartmentId);

  if (!selectedApartment) {
    notFound();
  }

  return (
    <ApartmentDetailsPage apartment={selectedApartment} />
  );
}

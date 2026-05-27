import ApartmentDetailsPage from "@/components/ApartmentDetailsPage";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return (
    <ApartmentDetailsPage />
  );
}
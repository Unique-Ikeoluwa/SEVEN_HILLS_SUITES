import BookingPage from "@/components/BookingPage";
import { RouteGuard } from "@/components/auth/RouteGuard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <RouteGuard>
      <BookingPage />
    </RouteGuard>
  );
}

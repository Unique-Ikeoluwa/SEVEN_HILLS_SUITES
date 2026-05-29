import { RouteGuard } from "@/components/auth/RouteGuard";
import Profile from "@/components/profile/Profile";

export default function page() {
  return (
    <RouteGuard>
      <Profile />
    </RouteGuard>
  );
}


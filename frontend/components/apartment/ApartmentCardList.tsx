import { useRouter } from "next/navigation";
import { AmenityBadges } from "./AmenityBadges";
import { SaveButtons } from "./SaveButtons";
import { ScoreBadge } from "./ScoreBadge";
import { ImageDots } from "./ImageDots";
import StarRating from "../ui/StarRating";
import { FiMapPin } from "react-icons/fi";
import { APIApartment } from "@/types/apartment";

interface ApartmentCardListProps {
  apt: APIApartment;
  saved: boolean;
  onToggleSave: () => void;
}

export function ApartmentCardList({ apt, saved, onToggleSave }: ApartmentCardListProps ) {
  const router = useRouter();

  const imageList = apt.images ? apt.images.split(",") : ["/fallback-apartment.jpg"];
  const primaryCardImage = imageList[0];
  
  const amenitiesList = apt.amenities ? apt.amenities.split(",") : [];

  const basePrice = parseInt(apt.price, 10) || 0;

  const mockRating = "4.5";
  const mockReviewCount = 28;
  const mockDistance = "1.2";

  return (
    <div
      onClick={() => router.push(`/apartments/${apt.id}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col sm:flex-row cursor-pointer"
    >
      <div className="relative w-full h-48 sm:w-60 shrink-0 bg-gray-50">
        <img src={primaryCardImage} alt={apt.title} className="w-full h-full object-cover" />
        <div onClick={(e) => e.stopPropagation()}>
          <SaveButtons saved={saved} onToggle={onToggleSave} />
        </div>
        <ImageDots />
      </div>

      <div className="flex flex-1 p-4 sm:p-5 gap-4 flex-col sm:flex-row">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{apt.title}</h3>
            <StarRating rating={parseFloat(mockRating)} />
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            <span className="flex items-center gap-1 text-[#0057FF] font-medium">
              <FiMapPin size={12} />
              {apt.location}
            </span>
            <span>·</span>
            <span>{mockDistance} km from centre</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              {apt.apartment_type || "Luxury Suite"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            {amenitiesList.slice(0, 4).map((amenity, idx) => (
              <span key={idx} className="flex items-center gap-2">
                {idx > 0 && <span className="text-gray-300">|</span>}
                {amenity.trim()}
              </span>
            ))}
          </div>
          
          <AmenityBadges freeCancellation={true} breakfastIncluded={false} />
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between shrink-0 sm:min-w-30 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <ScoreBadge rating={mockRating} reviews={mockReviewCount} />
          <div className="text-right">
            <p className="font-bold text-gray-900 text-sm sm:text-base">
              {apt.currency === "USD" ? "$" : "₦"} {basePrice.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400">per night</p>
          </div>
        </div>
      </div>
    </div>
  );
}
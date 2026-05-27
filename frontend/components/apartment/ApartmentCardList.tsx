import { AmenityBadges } from "./AmenityBadges";
import { SaveButtons } from "./SaveButtons";
import { ScoreBadge } from "./ScoreBadge";
import { ImageDots } from "./ImageDots";
import StarRating from "../ui/StarRating";
import { FiMapPin } from "react-icons/fi";
import { Apartment } from "@/types/apartment";


export function ApartmentCardList({ apt, saved, onToggleSave }: { apt: Apartment; saved: boolean; onToggleSave: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex">
      <div className="relative w-60 shrink-0">
        <img src={apt.image} alt={apt.name} className="w-full h-full object-cover" />
        <SaveButtons saved={saved} onToggle={onToggleSave} />
        <ImageDots />
      </div>
      <div className="flex flex-1 p-5 gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-lg">{apt.name}</h3>
            <StarRating rating={parseFloat(apt.rating)} />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1 text-blue-500 font-medium">
              <FiMapPin size={12} />
              {apt.location}
            </span>
            <span>·</span>
            <span>{apt.distanceCentre} km from centre</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
              </svg>
              Metro access
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-600 mb-4">
            {apt.amenities.map((a, idx) => (
              <span key={a} className="flex items-center gap-2">
                {idx > 0 && <span className="text-gray-300">|</span>}
                {a}
              </span>
            ))}
          </div>
          <AmenityBadges freeCancellation={apt.freeCancellation} breakfastIncluded={apt.breakfastIncluded} />
        </div>
        <div className="flex flex-col items-end justify-between shrink-0 min-w-30">
          <ScoreBadge rating={apt.rating} reviews={apt.reviews} />
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">₦ {apt.price.toLocaleString()}.00</p>
            <p className="text-xs text-gray-400">per nights, 2 adults</p>
          </div>
        </div>
      </div>
    </div>
  );
}
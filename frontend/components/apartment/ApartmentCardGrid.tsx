"use client";

import { useRouter } from "next/navigation";
import { SaveButtons } from "./SaveButtons";
import { ImageDots } from "./ImageDots";
import StarRating from "../ui/StarRating";
import { FiMapPin } from "react-icons/fi";
import { APIApartment } from "@/types/apartment";

interface ApartmentCardGridProps {
  apt: APIApartment;
  saved: boolean;
  onToggleSave: () => void;
}

export function ApartmentCardGrid({ apt, saved, onToggleSave }: ApartmentCardGridProps) {
  const router = useRouter();

  const imageList = apt.images ? apt.images.split(",") : ["/fallback-apartment.jpg"];
  const primaryGridImage = imageList[0];
  
  const amenitiesList = apt.amenities ? apt.amenities.split(",") : [];

  const basePrice = parseInt(apt.price, 10) || 0;

  const mockRating = "4.5";
  const mockReviewCount = 28;

  return (
    <div
      onClick={() => router.push(`/apartments/${apt.id}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="relative h-44 sm:h-48 bg-gray-50">
        <img src={primaryGridImage} alt={apt.title} className="w-full h-full object-cover" />
        <div onClick={(e) => e.stopPropagation()}>
          <SaveButtons saved={saved} onToggle={onToggleSave} />
        </div>
        <ImageDots />
      </div>

      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{apt.title}</h3>
            <StarRating rating={parseFloat(mockRating)} />
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-[#0057FF] font-semibold leading-none">Excellent</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{mockReviewCount} reviews</p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center justify-center">
              {mockRating}
            </div>
          </div>
        </div>

        <p className="text-xs text-[#0057FF] font-medium flex items-center gap-1">
          <FiMapPin size={12} />
          {apt.location}
        </p>

        <div className="flex flex-wrap gap-1 text-xs text-gray-600 mt-auto pt-2 border-t border-gray-50">
          {amenitiesList.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="truncate max-w-20">
              {amenity.trim()}
              {idx < Math.min(amenitiesList.length, 3) - 1 ? " ·" : ""}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex gap-1">
            <span className="text-[10px] text-green-600 bg-green-50 rounded-full px-2 py-0.5 font-medium">
              Free cancel
            </span>
          </div>
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

import { SaveButtons } from "./SaveButtons";
import { ImageDots } from "./ImageDots";
import StarRating from "../ui/StarRating";
import { FiMapPin } from "react-icons/fi";
import { Apartment } from "@/types/apartment";



export function ApartmentCardGrid({ apt, saved, onToggleSave }: { apt: Apartment; saved: boolean; onToggleSave: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="relative h-48">
        <img src={apt.image} alt={apt.name} className="w-full h-full object-cover" />
        <SaveButtons saved={saved} onToggle={onToggleSave} />
        <ImageDots />
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-gray-900">{apt.name}</h3>
            <StarRating rating={parseFloat(apt.rating)} />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="text-right">
              <p className="text-xs text-blue-500 font-semibold leading-none">Excellent</p>
              <p className="text-[10px] text-gray-400">{apt.reviews} reviews</p>
            </div>
            <div className="w-8 h-8 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center justify-center">
              {apt.rating}
            </div>
          </div>
        </div>
        <p className="text-xs text-blue-500 font-medium flex items-center gap-1">
          <FiMapPin size={12} />
          {apt.location}
        </p>
        <div className="flex flex-wrap gap-1 text-xs text-gray-600 mt-auto pt-2 border-t border-gray-50">
          {apt.amenities.slice(0, 3).map((a, i) => (
            <span key={a}>{a}{i < Math.min(apt.amenities.length, 3) - 1 ? " ·" : ""}</span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex gap-1">
            {apt.freeCancellation && (
              <span className="text-[10px] text-green-600 bg-green-50 rounded-full px-2 py-0.5">Free cancel</span>
            )}
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900 text-sm">₦ {apt.price.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400">per night</p>
          </div>
        </div>
      </div>
    </div>
  );
}

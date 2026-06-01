"use client";

import { useRouter } from "next/navigation";
import { APIApartment } from "@/types/apartment";
import { ImageGallery } from "./details/ImageGallery";
import { Review } from "./details/Review";
import { Features } from "./details/Features";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useBookingStore } from "@/store/bookingStore";
import { useAuthStore } from "@/store/authStore";

interface ApartmentDetailsPageProps {
  apartment: APIApartment;
}

export default function ApartmentDetailsPage({ apartment }: ApartmentDetailsPageProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { setBasePrice } = useBookingStore();

  const galleryImages = apartment.images ? apartment.images.split(",") : ["/fallback-apartment.jpg"];
  const amenitiesArray = apartment.amenities ? apartment.amenities.split(",") : [];
  const numericPrice = parseInt(apartment.price, 10) || 0;

  const handleBookingRedirect = () => {
    setBasePrice(numericPrice); 
    
    if (isAuthenticated) {
      router.push(`/apartments/${apartment.id}/booking`);
    } else {
      router.push(`/login?redirect=/apartments/${apartment.id}/booking`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
        >
          <MdKeyboardArrowLeft />
          Back to listings
        </button>
        <ImageGallery images={galleryImages} />
        <div className="mb-6 space-y-2 pt-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {apartment.title}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#0057FF]">
            {apartment.location} • {apartment.apartment_type}
          </p>
        </div>
        <div className="mb-8 space-y-3">
          <p className="text-gray-600 text-[15px] leading-relaxed">
            {apartment.description || 
              `Welcome to ${apartment.title}. This fully optimized ${apartment.apartment_type} is located in ${apartment.location} and features premium amenities meticulously structured for maximum comfort and convenience.`
            }
          </p>
        </div>
        {amenitiesArray.length > 0 && (
          <div className="mb-8 p-5 bg-gray-50 border border-gray-100 rounded-2xl">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Apartment Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {amenitiesArray.map((amenity, index) => (
                <span key={index} className="text-xs bg-white border border-gray-100 px-3 py-1.5 rounded-xl font-medium text-gray-700 shadow-sm">
                  {amenity.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-2xl px-4 sm:px-6 py-4 mb-10 border border-gray-100 gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="font-semibold text-gray-900 text-lg">
              {apartment.apartment_type}
            </span>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-left sm:text-right">
              <span className="block text-xs text-gray-400 font-medium leading-none mb-1">Total package:</span>
              <span className="block text-xl font-bold text-gray-900">
                {apartment.currency === "USD" ? "$" : "₦"} {numericPrice.toLocaleString()}.00
              </span>
            </div> 
            <button  
              onClick={handleBookingRedirect}
              className="px-5 sm:px-6 py-2.5 bg-[#0057FF] text-white text-sm font-semibold rounded-xl hover:bg-[#0f53db] transition-colors shrink-0"
            >
              Book now
            </button>
          </div>
        </div>
        <Features apartment={apartment}/>
        <Review apartment={apartment}/>
      </div>
    </div>
  );
}
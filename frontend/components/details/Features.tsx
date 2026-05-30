"use client";

import { amenityIcons } from "@/data/icons";
import { APIApartment } from "@/types/apartment";

interface FeaturesProps {
  apartment: APIApartment;
}

export function Features({ apartment }: FeaturesProps) {
  const amenitiesList = apartment.amenities ? apartment.amenities.split(",") : [];
  const mockBedrooms = 1;
  const mockBathrooms = 1;

  return (
    <>
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Basic Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8">
              <path d="M2 4v16M22 4v16M2 8h20M7 12h4M13 12h4M7 16h4M13 16h4" />
            </svg>
            Number of Bedrooms: <span className="font-bold text-gray-900 ml-1">{mockBedrooms}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8">
              <path d="M4 12h16M4 12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12l4 4v4" />
              <path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />
            </svg>
            Number of Bathrooms: <span className="font-bold text-gray-900 ml-1">{mockBathrooms}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
            Furnished: <span className="font-bold text-blue-600 ml-1">Yes</span>
          </div>
        </div>
      </section>

      <hr className="border-gray-100 mb-10" />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Amenities & Included Utilities</h2>
        
        {amenitiesList.length === 0 ? (
          <p className="text-sm text-gray-400">No core utilities specified for this luxury listing package.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4">
            {amenitiesList.map((item, idx) => {
              const cleanedAmenity = item.trim();
              return (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-gray-400">
                    {amenityIcons[cleanedAmenity] ?? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    )}
                  </span>
                  {cleanedAmenity}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

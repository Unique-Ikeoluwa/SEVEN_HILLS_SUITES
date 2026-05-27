"use client";

import { MOCK_APARTMENT, applianceLabels } from "@/data/apartments";
import { amenityIcons, applianceIcons } from "@/data/icons";

export function Features() {

    const apt = MOCK_APARTMENT; 
    
    return (
        <>
            <section className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Basic Features</h2>
                <div className="grid grid-cols-3 gap-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8"><path d="M2 4v16M22 4v16M2 8h20M7 12h4M13 12h4M7 16h4M13 16h4"/></svg>
                        Number of Bedrooms: <span className="font-bold text-gray-900 ml-1">{apt.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8"><path d="M4 12h16M4 12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12l4 4v4"/><path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"/></svg>
                        Number of Bathrooms: <span className="font-bold text-gray-900 ml-1">{apt.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                        Furnished: <span className="font-bold text-blue-600 ml-1">{apt.furnished ? "Yes" : "No"}</span>
                    </div>
                </div>
            </section>
    
            <hr className="border-gray-100 mb-10" />
    
            {/* Appliances */}
            <section className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Appliances</h2>
                <div className="grid grid-cols-3 gap-y-4">
                {applianceLabels.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-gray-400">{applianceIcons[key]}</span>
                    {label} :{" "}
                    <span className={`font-bold ml-1 ${apt.appliances[key] ? "text-blue-600" : "text-gray-900"}`}>
                        {apt.appliances[key] ? "Yes" : "No"}
                    </span>
                    </div>
                ))}
                </div>
            </section>
    
            <hr className="border-gray-100 mb-10" />
    
            {/* Amenities */}
            <section className="mb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Amenities</h2>
                <div className="grid grid-cols-3 gap-y-4">
                {apt.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-gray-400">{amenityIcons[amenity] ?? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>}</span>
                    {amenity}
                    </div>
                ))}
                </div>
            </section>
        </>
    );
}

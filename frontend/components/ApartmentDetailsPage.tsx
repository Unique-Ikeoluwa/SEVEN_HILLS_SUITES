"use client";

import { useRouter } from "next/navigation";
import { MOCK_APARTMENT } from "@/data/apartments";
import { ImageGallery } from "./details/ImageGallery";
import { Review } from "./details/Review";
import { Features } from "./details/Features";


export default function ApartmentDetailsPage() {
  const router = useRouter();
  const apt = MOCK_APARTMENT; 


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to listings
        </button>
        <ImageGallery images={apt.images} />
        <div className="mb-8 space-y-3">
          {apt.description.map((para, i) => (
            <p key={i} className="text-gray-600 text-[15px] leading-relaxed">{para}</p>
          ))}
        </div>
        <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-6 py-4 mb-10 border border-gray-100">
            <div className="flex items-center gap-3">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="font-semibold text-gray-900 text-lg">{apt.type}</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Total package:</p>
                    <p className="text-xl font-bold text-gray-900">₦ {apt.price.toLocaleString()}.00</p>
                </div>
                <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                    Book now
                </button>
            </div>
        </div>

        <Features />
        <Review />

      </div>
    </div>
  );
}
"use client";

import { SortDropdownProps } from "@/types/apartment";
import { SORT_OPTIONS } from "@/constants/apartmentFilter";
import { LuChevronDown } from "react-icons/lu";

export function SortDropdown({sortBy, sortOpen, setSortOpen, setSortBy,}: SortDropdownProps) {
    return (
        <div className="relative">
            <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 bg-white hover:border-gray-300 transition-colors"
            >
            Sort by: {sortBy}
            <LuChevronDown size={14} />
            </button>
            {sortOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-100 rounded-xl shadow-lg z-20 min-w-50 py-1">
                {SORT_OPTIONS.map((opt) => (
                <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    sortBy === opt ? "text-blue-500 font-medium" : "text-gray-700"
                    }`}
                >
                    {opt}
                </button>
                ))}
            </div>
            )}
        </div>
    );
}
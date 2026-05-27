"use client";

import { ViewMode } from "@/types/apartment";
import { LuLayoutGrid, LuList } from "react-icons/lu";

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
}

export function ViewToggle({
  viewMode,
  setViewMode,
}: ViewToggleProps) {
    return (
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
                onClick={() => setViewMode("list")}
                title="List view"
                className={`w-10 h-10 flex items-center justify-center transition-colors ${
                viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"
                }`}
            >
                <LuList size={16} />
            </button>
            <button
                onClick={() => setViewMode("grid")}
                title="Grid view"
                className={`w-10 h-10 flex items-center justify-center transition-colors ${
                viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"
                }`}
            >
                <LuLayoutGrid size={16} />
            </button>
        </div>
    );
}
"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ViewMode, SortOption, FilterOption } from "@/types/apartment";
import { ApartmentCardGrid } from "./apartment/ApartmentCardGrid";
import { ApartmentCardList } from "./apartment/ApartmentCardList";
import { Pagination } from "./apartment/Pagination";
import { ALL_APARTMENTS } from "@/data/apartments";
import { PER_PAGE } from "@/constants/apartmentFilter"
import { SortDropdown } from "./apartment/SortDropdown";
import { ViewToggle } from "./apartment/ViewToggle";
import { EmptyState } from "./apartment/EmptyState";
import { sortApartments, filterApartments, paginateApartments } from "@/utils/apartmentHelpers";


export default function ApartmentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const typeParam = (searchParams.get("type") ?? "All") as FilterOption;

  const [activeFilter, setActiveFilter] = useState<FilterOption>(typeParam);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("Property type");
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    setActiveFilter(typeParam);
    setPage(1);
  }, [typeParam]);

  const handleFilterChange = useCallback(
    (filter: FilterOption) => {
      setActiveFilter(filter);
      setPage(1);
      const params = new URLSearchParams(searchParams.toString());
      if (filter === "All") {
        params.delete("type");
      } else {
        params.set("type", filter);
      }
      router.push(`/apartments?${params.toString()}`);
    },
    [searchParams, router]
  );

  const toggleSave = (id: number) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = filterApartments(ALL_APARTMENTS, activeFilter);      
  const sorted = sortApartments(filtered, sortBy);
  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated = paginateApartments(sorted, page, PER_PAGE);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-500 font-semibold text-sm mb-2 tracking-wide">Our Apartments</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Every Stay, Thoughtfully
            <br />
            Furnished.
          </h1>
          <p className="text-gray-500 text-base max-w-2xl leading-relaxed">
            Browse our range of fully serviced apartments across Makurdi and Kampala. Every unit is move-in ready,
            amenity-packed, and designed to feel like home.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Explore Accommodations</h2>

        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <SortDropdown sortBy={sortBy} sortOpen={sortOpen} setSortOpen={setSortOpen} setSortBy={setSortBy}/>
            {activeFilter !== "All" && (
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 bg-white">
                {activeFilter}
                <button
                  onClick={() => handleFilterChange("All")}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}

            <span className="text-sm text-gray-400">{filtered.length} properties</span>
          </div>
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode}/>          
        </div>
        {/* Listings */}
        {paginated.length === 0 ? (
          <EmptyState onClear={() => handleFilterChange("All")} />
        ) : viewMode === "list" ? (
          <div className="flex flex-col gap-4">
            {paginated.map((apt) => (
              <ApartmentCardList key={apt.id} apt={apt} saved={saved.has(apt.id)} onToggleSave={() => toggleSave(apt.id)} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {paginated.map((apt) => (
              <ApartmentCardGrid key={apt.id} apt={apt} saved={saved.has(apt.id)} onToggleSave={() => toggleSave(apt.id)} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination current={page} total={totalPages} onChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}
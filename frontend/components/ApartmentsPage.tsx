"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ViewMode, SortOption, FilterOption, APIApartment } from "@/types/apartment";
import { ApartmentCardGrid } from "./apartment/ApartmentCardGrid";
import { ApartmentCardList } from "./apartment/ApartmentCardList";
import { Pagination } from "./apartment/Pagination";
import { PER_PAGE } from "@/constants/apartmentFilter";
import { SortDropdown } from "./apartment/SortDropdown";
import { ViewToggle } from "./apartment/ViewToggle";
import { EmptyState } from "./apartment/EmptyState";
import { api } from "@/utils/api";

export default function ApartmentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const typeParam = (searchParams.get("type") ?? "All") as FilterOption;
  const searchParam = searchParams.get("search") ?? "";
  const locationParam = searchParams.get("location") ?? "";

  const [activeFilter, setActiveFilter] = useState<FilterOption>(typeParam);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("Property type");
  const [sortOpen, setSortOpen] = useState(false);

  const [liveApartments, setLiveApartments] = useState<APIApartment[]>([]);
  const [backupCurated, setBackupCurated] = useState<APIApartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSearchWithNoResults, setHasSearchWithNoResults] = useState(false);

  useEffect(() => {
    setActiveFilter(typeParam);
    setPage(1);
  }, [typeParam]);

  useEffect(() => {
    setPage(1);
  }, [searchParam]);

  useEffect(() => {
    async function fetchLiveInventory() {
      setLoading(true);
      try {
        const queryParams: Record<string, any> = {
          status: "available",
          search: searchParam || undefined,
          location: locationParam || undefined,
        };
        if (activeFilter !== "All") {
          queryParams.search = activeFilter;
        }

        const res = await api.get("/apartments", { params: queryParams });
        
        if (res.data?.success) {
          const dataPayload = res.data.data;

          if (searchParam && dataPayload.length === 0) {
            setHasSearchWithNoResults(true);
            const fallbackRes = await api.get("/apartments", { params: { status: "available" } });
            if (fallbackRes.data?.success) {
              setLiveApartments(fallbackRes.data.data);
            }
          } else {
            setHasSearchWithNoResults(false);
            setLiveApartments(dataPayload);
          }
        }
      } catch (err) {
        console.error("Discovery stream compilation error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveInventory();
  }, [activeFilter, searchParam, locationParam]);

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

  const sortedApartments = [...liveApartments].sort((a, b) => {
    if (sortBy === "Price: Low to High") return parseInt(a.price) - parseInt(b.price);
    if (sortBy === "Price: High to Low") return parseInt(b.price) - parseInt(a.price);
    return 0;
  });

  const totalPages = Math.ceil(sortedApartments.length / PER_PAGE);
  
  const startIndex = (page - 1) * PER_PAGE;
  const paginatedApartments = sortedApartments.slice(startIndex, startIndex + PER_PAGE);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0057FF] rounded-full animate-spin mr-3" />
        <p className="text-gray-500 font-semibold text-sm">Syncing accommodation indexes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#0057FF] font-semibold text-sm mb-2 tracking-wide">Our Apartments</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Every Stay, Thoughtfully<br className="hidden sm:block" /> Furnished.
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed">
            Browse our range of fully serviced apartments across Makurdi and Kampala. Every unit is move-in ready, amenity-packed, and designed to feel like home.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Explore Accommodations</h2>
        
        {hasSearchWithNoResults && (
          <div className="mb-8 p-4 sm:p-6 bg-blue-50 border border-blue-100 rounded-2xl animate-fadeIn">
            <p className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed">
              We don&apos;t have what you&apos;re looking for but we have other available apartments carefully curated for you.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <SortDropdown sortBy={sortBy} sortOpen={sortOpen} setSortOpen={setSortOpen} setSortBy={setSortBy} />
            
            {activeFilter !== "All" && (
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-full text-xs sm:text-sm text-gray-700 bg-white">
                {activeFilter}
                <button onClick={() => handleFilterChange("All")} className="text-gray-400 hover:text-gray-700 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}

            {searchParam && (
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-full text-xs sm:text-sm text-gray-700 bg-white">
                &ldquo;{searchParam}&rdquo;
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("search");
                    router.push(`/apartments?${params.toString()}`);
                  }}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
            <span className="text-xs sm:text-sm text-gray-400">{sortedApartments.length} properties</span>
          </div>
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        {paginatedApartments.length === 0 ? (
          <EmptyState onClear={() => handleFilterChange("All")} />
        ) : viewMode === "list" ? (
          <div className="flex flex-col gap-4">
            {paginatedApartments.map((apt) => (
              <ApartmentCardList key={apt.id} apt={apt} saved={saved.has(apt.id)} onToggleSave={() => toggleSave(apt.id)} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paginatedApartments.map((apt) => (
              <ApartmentCardGrid key={apt.id} apt={apt} saved={saved.has(apt.id)} onToggleSave={() => toggleSave(apt.id)} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination current={page} total={totalPages} onChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}

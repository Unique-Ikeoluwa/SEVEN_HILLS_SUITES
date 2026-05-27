import { Apartment, SortOption, FilterOption } from "@/types/apartment";

export function sortApartments(apartments: Apartment[], sortBy: SortOption): Apartment[] {
  const sorted = [...apartments];

  switch (sortBy) {
    case "Price: Low to High":
      return sorted.sort((a, b) => a.price - b.price);

    case "Price: High to Low":
      return sorted.sort((a, b) => b.price - a.price);

    case "Rating":
      return sorted.sort(
        (a, b) => parseFloat(b.rating) - parseFloat(a.rating)
      );

    default:
      return sorted;
  }
}

export function filterApartments(apartments: Apartment[], filter: FilterOption): Apartment[] {
  if (filter === "All") return apartments;
  return apartments.filter((a) => a.type === filter);
}

export function paginateApartments(apartments: Apartment[], page: number, perPage: number
): Apartment[] {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return apartments.slice(start, end);
}
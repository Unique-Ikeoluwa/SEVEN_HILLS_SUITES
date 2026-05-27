export type ApartmentType = "Studio" | "1 Bedroom" | "2 Bedroom" | "Furnished & Serviced";

export interface ApartmentCard {
  label: string;
  type: ApartmentType;
  image: string;
}

export type ViewMode = "list" | "grid";

export type SortOption =
  | "Property type"
  | "Price: Low to High"
  | "Price: High to Low"
  | "Rating";

export type FilterOption =
  | "All"
  | ApartmentType;

export interface Apartment {
  id: number;
  name: string;
  type: ApartmentType;
  location: string;
  price: number;
  rating: string;
  reviews: number;
  image: string;
  amenities: string[];
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  distanceCentre: string;
}

export interface SortDropdownProps {
  sortBy: SortOption;
  sortOpen: boolean;
  setSortOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;
}
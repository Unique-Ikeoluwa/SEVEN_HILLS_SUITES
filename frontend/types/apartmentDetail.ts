import { Review } from "./review";

export interface ApartmentDetail {
  id: number;
  name: string;
  type: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string[];
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  appliances: {
    refrigerator: boolean;
    ovenStove: boolean;
    microwave: boolean;
    washerDryer: boolean;
    waterHeater: boolean;
  };
  amenities: string[];
  images: string[];
  reviews: Review[];
}
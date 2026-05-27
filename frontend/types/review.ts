export interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  time: string;
}

export interface ReviewsSectionProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}
import { ApartmentCard, Apartment, ApartmentType } from "@/types/apartment";

export const apartments: ApartmentCard[] = [
  {
    label: "Studio Apartment",
    type: "Studio",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop",
  },
  {
    label: "1 Bedroom Apartment",
    type: "1 Bedroom",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop",
  },
  {
    label: "2 Bedroom Apartment",
    type: "2 Bedroom",
    image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=600&auto=format&fit=crop",
  },
  {
    label: "Furnished & Serviced",
    type: "Furnished & Serviced",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop",
  },
];

export const ALL_APARTMENTS: Apartment[] = Array.from({ length: 47 }, (_, i) => {
  const types: ApartmentType[] = ["Studio", "1 Bedroom", "2 Bedroom", "Furnished & Serviced"];
  const names = ["Room D1", "Suite A2", "Loft B3", "Penthouse C4", "Room E5"];
  const locations = ["Makurdi, Nigeria", "Kampala, Uganda"];
  const prices = [75000, 95000, 120000, 150000, 200000];
  const amenitiesByType: Record<ApartmentType, string[]> = {
    Studio: ["Studio", "Single Bed", "Kitchen", "Tv"],
    "1 Bedroom": ["1 Bedroom", "King Bed", "Kitchen", "Tv"],
    "2 Bedroom": ["2 Bedrooms", "King Bed", "Kitchen", "Tv", "Living Room"],
    "Furnished & Serviced": ["1 Bedroom", "Queen Bed", "Kitchen", "Tv", "Workspace"],
  };
  const imgs = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop",
  ];
  const type = types[i % 4];
  return {
    id: i + 1,
    name: names[i % names.length],
    type,
    location: locations[i % 2],
    price: prices[i % prices.length],
    rating: (4.5 + Math.random() * 0.5).toFixed(1),
    reviews: Math.floor(15 + Math.random() * 40),
    image: imgs[i % imgs.length],
    amenities: amenitiesByType[type],
    freeCancellation: i % 3 !== 0,
    breakfastIncluded: i % 2 === 0,
    distanceCentre: (0.8 + Math.random() * 3).toFixed(1),
  };
});

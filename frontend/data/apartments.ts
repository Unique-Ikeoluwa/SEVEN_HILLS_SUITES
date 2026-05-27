import { ApartmentCard, Apartment, ApartmentType } from "@/types/apartment";
import { ApartmentDetail } from "@/types/apartmentDetail";

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

export const MOCK_APARTMENT: ApartmentDetail = {
  id: 1,
  name: "Room D1",
  type: "1 bedroom",
  price: 120000,
  rating: 4.5,
  reviewCount: 11,
  description: [
    "Lorem ipsum dolor sit amet consectetur. Commodo elementum sed quis porttitor dui in felis. Tellus morbi mus nec congue orci. Lorem ipsum dolor sit amet consectetur. Commodo elementum sed quis porttitor dui in felis. Tellus morbi mus nec congue orci.Lorem ipsum dolor sit amet consectetur. Commodo elementum sed quis porttitor dui in felis. Tellus morbi mus nec congue orci.",
    "Lorem ipsum dolor sit amet consectetur. Amet pulvinar pharetra tellus diam vulputate fermentum. Rhoncus facilisis nunc eleifend proin massa.",
  ],
  bedrooms: 3,
  bathrooms: 2,
  furnished: true,
  appliances: {
    refrigerator: true,
    ovenStove: true,
    microwave: false,
    washerDryer: false,
    waterHeater: true,
  },
  amenities: [
    "Always-On Power",
    "Solar & Generator Backup",
    "Free High-Speed WiFi",
    "Smart TV",
    "Air Conditioning",
    "Fully Equipped Kitchen",
    "Regular Housekeeping",
    "Secure Environment",
    "Reliable Water Supply",
    "Laundry Support",
    "Bar & Relaxation Area",
    "Dedicated Parking",
  ],
  images: [
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=600&auto=format&fit=crop",
  ],
  reviews: Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    name: ["Nicolas Jensen", "Amara Okonkwo", "James Terlumun", "Sofia Mensah", "David Aliyu"][i % 5],
    avatar: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&facepad=3",
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop",
    ][i % 5],
    rating: 4 + (i % 2),
    text: "Lorem ipsum dolor sit amet consectetur. Id vel quis pretium orci. Vitae nunc suspendisse commodo elit duis morbi mattis eget.",
    time: i === 0 ? "about 1 hour ago" : i < 3 ? "2 days ago" : "1 week ago",
  })),
};

export const ALL_APARTMENTS: Apartment[] = Array.from({ length: 47 }, (_, i) => {
  const types: ApartmentType[] = ["Studio", "1 Bedroom", "2 Bedroom", "Furnished & Serviced"];
  const names = ["Room D1", "Suite A2", "Loft B3", "Penthouse C4", "Room E5"];
  const locations = ["Makurdi, Nigeria", "Kampala, Uganda"];
  const prices = [75000, 95000, 120000, 150000, 200000];
  const amenitiesByType: Record<ApartmentType, string[]> = {
    Studio: ["Studio", "Single Bed", "Kitchen", "Tv"],
    "1 Bedroom": ["1 bedroom", "King Bed", "Kitchen", "Tv"],
    "2 Bedroom": ["2 bedrooms", "King Bed", "Kitchen", "Tv", "Living Room"],
    "Furnished & Serviced": ["1 bedroom", "Queen Bed", "Kitchen", "Tv", "Workspace"],
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

export const applianceLabels: { key: keyof typeof MOCK_APARTMENT.appliances; label: string }[] = [
    { key: "refrigerator", label: "Refrigerator" },
    { key: "ovenStove", label: "Oven/Stove" },
    { key: "microwave", label: "Microwave" },
    { key: "washerDryer", label: "Washer/Dryer" },
    { key: "waterHeater", label: "Water Heater" },
  ];
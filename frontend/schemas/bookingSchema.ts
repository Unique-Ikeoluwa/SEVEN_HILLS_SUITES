import { z } from "zod";

export const bookingSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  idType: z.string().min(1, "Select an ID type"),
  idNumber: z.string().min(3, "ID number is required"),
  specialRequest: z.string().optional(),
  guests: z.number().min(1, "Must have at least 1 guest"),
  paymentMethod: z.enum(["naira", "crypto"]),
  
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
}).refine((data) => {
  const start = new Date(data.checkIn);
  const end = new Date(data.checkOut);
  return end > start;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"],
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

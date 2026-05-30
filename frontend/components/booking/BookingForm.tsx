"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingFormValues } from "@/schemas/bookingSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";
import { useState } from "react";

import { DateSelector } from "./DateSelector";
import { GuestSelector } from "./GuestSelector";
import { PaymentMethod } from "./PaymentMethod";

interface BookingFormProps {
  apartmentId: string;
}

export function BookingForm({ apartmentId }: BookingFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", idType: "", idNumber: "", specialRequest: "",
      guests: 1, paymentMethod: "naira", checkIn: "", checkOut: "",
    },
  });

  const activeMethodInput = watch("paymentMethod") as "naira" | "crypto";

  const onSubmit: SubmitHandler<BookingFormValues> = async (data) => {
    setApiError(null);
    try {
      const res = await api.post("/bookings", {
        apartment_id: apartmentId,
        check_in: data.checkIn,
        check_out: data.checkOut,
        guest_name: data.fullName,
        guest_email: data.email,
        guest_phone: data.phone,
        payment_type: data.paymentMethod === "naira" ? "fiat" : "crypto",
      });

      if (res.data?.success && res.data?.data?.payment?.authorization_url) {
        window.location.href = res.data.data.payment.authorization_url;
      } else if (res.data?.success && data.paymentMethod === "crypto") {
        alert("Crypto payment session initialized. Check the backend integration details!");
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to initialize and authorize your booking session.");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <DateSelector register={register} watch={watch} errors={errors} />

        <GuestSelector 
          value={watch("guests") as number} 
          onChange={(value) => setValue("guests", value, { shouldValidate: true })} 
        />

        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Customer Information</h2>
          {apiError && <div className="p-3.5 text-sm bg-red-50 text-red-600 border border-red-200 rounded-xl text-center font-semibold">{apiError}</div>}
          
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder="Abdul Chike..." {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input placeholder="example@email.com" {...register("email")}/>
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input placeholder="+234..." {...register("phone")} />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>
        </div>

        <PaymentMethod 
          value={activeMethodInput} 
          onChange={(value) => setValue("paymentMethod", value, { shouldValidate: true })} 
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-4 rounded-2xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Redirecting to Secure Gateway...
            </>
          ) : (
            "Confirm Booking"
          )}
        </button>
      </form>
    </div>
  );
}

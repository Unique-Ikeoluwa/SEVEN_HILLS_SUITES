"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingFormValues } from "@/schemas/bookingSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DateSelector } from "./DateSelector";
import { GuestSelector } from "./GuestSelector";
import { PaymentMethod } from "./PaymentMethod";

export function BookingForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      idType: "",
      idNumber: "",
      specialRequest: "",
      guests: 1,
      paymentMethod: "naira",
      checkIn: "",
      checkOut: "",
    },
  });

  const onSubmit: SubmitHandler<BookingFormValues> = async (data) => {
    console.log("Form Submission Success:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <DateSelector register={register} watch={watch} errors={errors} />

      <GuestSelector 
        value={watch("guests") as number} 
        onChange={(value) => setValue("guests", value, { shouldValidate: true })} 
      />

      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-5">
        <h2 className="text-lg font-bold text-gray-900">Guest Details</h2>
        
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
        
        <div className="space-y-2">
          <Label>Government ID</Label>
          <Input placeholder="National ID / Passport" {...register("idType")} />
          {errors.idType && <p className="text-sm text-red-500">{errors.idType.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Government ID Number</Label>
          <Input placeholder="A00000000" {...register("idNumber")} />
          {errors.idNumber && <p className="text-sm text-red-500">{errors.idNumber.message}</p>}
        </div>
      </div>

      <PaymentMethod 
        value={watch("paymentMethod") as "naira" | "crypto"} 
        onChange={(value) => setValue("paymentMethod", value, { shouldValidate: true })} 
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-4 rounded-2xl font-semibold"
      >
        {isSubmitting ? "Processing..." : "Confirm Booking"}
      </button>
    </form>
  );
}

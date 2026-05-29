"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const apartmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.string().min(1, "Price is required"),
  description: z.string().optional(),
  location: z.string().min(3, "Location is required"),
  currency: z.enum(["USD", "NGN"]),
  amenities: z.string().min(1, "Amenities are required"),
  apartment_type: z.string().min(2, "Specify type (e.g. Studio, Penthouse)"),
});

type ApartmentValues = z.infer<typeof apartmentSchema>;

export function CreateApartmentForm() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ApartmentValues>({
    resolver: zodResolver(apartmentSchema),
    defaultValues: { title: "", price: "", description: "", location: "", currency: "NGN", amenities: "", apartment_type: "" }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 6);
      setImageFiles(filesArray);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 2);
      setVideoFiles(filesArray);
    }
  };

  const onSubmit = async (data: ApartmentValues) => {
    setStatusMsg(null);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("price", data.price);
      formData.append("description", data.description || "");
      formData.append("location", data.location);
      formData.append("currency", data.currency);
      formData.append("amenities", data.amenities);
      formData.append("apartment_type", data.apartment_type);
      imageFiles.forEach((file) => formData.append("images", file));
      videoFiles.forEach((file) => formData.append("videos", file));
      const res = await api.post("/apartments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatusMsg({ success: true, text: res.data.message || "Apartment created successfully!" });
      reset();
      setImageFiles([]);
      setVideoFiles([]);
    } catch (err: any) {
      setStatusMsg({
        success: false,
        text: err.response?.data?.message || "Failed to compile file streams or create apartment listing.",
      });
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Listing Specifications</h2>

      {statusMsg && (
        <div className={`p-4 text-sm font-medium rounded-xl text-center mb-6 border ${
          statusMsg.success ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600"
        }`}>
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Apartment Title</Label>
            <Input placeholder="Imperial Suite" {...register("title")} />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Apartment Variant Type</Label>
            <Input placeholder="Executive Suite, Penthouse, Studio" {...register("apartment_type")} />
            {errors.apartment_type && <p className="text-xs text-red-500">{errors.apartment_type.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-1.5">
            <Label>Price per night</Label>
            <Input type="number" placeholder="250000" {...register("price")} />
            {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Currency</Label>
            <select 
              {...register("currency")}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm bg-white outline-none focus:border-gray-400 transition-colors"
            >
              <option value="NGN">NGN (₦)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Location / Address</Label>
            <Input placeholder="Lekki, Lagos" {...register("location")} />
            {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Amenities (Comma-separated)</Label>
            <Input placeholder="Pool, Wifi, Spa, AC, Power" {...register("amenities")} />
            {errors.amenities && <p className="text-xs text-red-500">{errors.amenities.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Description Description</Label>
          <textarea
            placeholder="Provide a detailed description of the suite features..."
            rows={4}
            {...register("description")}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-gray-400 transition-colors"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <Label className="font-semibold text-gray-900">Upload Gallery Images (Max 6)</Label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <p className="text-xs text-gray-500 font-medium">Click or Drag images here</p>
              {imageFiles.length > 0 && <p className="text-xs text-amber-600 font-bold mt-1">{imageFiles.length} images staged</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-gray-900">Upload Walkthrough Videos (Max 2)</Label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
              <input type="file" accept="video/*" multiple onChange={handleVideoChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <p className="text-xs text-gray-500 font-medium">Click or Drag videos here</p>
              {videoFiles.length > 0 && <p className="text-xs text-amber-600 font-bold mt-1">{videoFiles.length} videos staged</p>}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gray-900 hover:bg-gray-800 transition-colors text-white py-4 rounded-xl font-semibold disabled:opacity-50 mt-4"
        >
          {isSubmitting ? "Processing Upload Streams..." : "Publish Apartment Listing"}
        </button>
      </form>
    </div>
  );
}

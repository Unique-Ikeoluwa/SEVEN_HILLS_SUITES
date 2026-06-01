"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/utils/api";
import { APIApartment } from "@/types/apartment";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const editSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.string().min(1, "Price is required"),
  description: z.string().optional(),
  location: z.string().min(3, "Location is required"),
  currency: z.enum(["USD", "NGN"]),
  amenities: z.string().min(1, "Amenities are required"),
  apartment_type: z.string().min(2, "Specify type"),
});

type EditValues = z.infer<typeof editSchema>;

export function ManageApartment() {
  const [apartments, setApartments] = useState<APIApartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingApt, setEditingApt] = useState<APIApartment | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);

const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const filesArray = Array.from(e.target.files).slice(0, 6);
    setEditImageFiles(filesArray);
  }
};

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
  });

  const fetchInventory = async () => {
    try {
      const res = await api.get("/apartments");
      if (res.data?.success) setApartments(res.data.data);
    } catch (err) {
      console.error("Failed to fetch admin inventory logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const startEdit = (apt: APIApartment) => {
    setEditingApt(apt);
    reset({
      title: apt.title,
      price: apt.price.toString(),
      description: apt.description || "",
      location: apt.location,
      currency: apt.currency as "USD" | "NGN",
      amenities: apt.amenities,
      apartment_type: apt.apartment_type,
    });
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to completely delete this apartment listing?")) return;
    try {
      await api.delete(`/apartments/${id}`);
      fetchInventory();
    } catch (err) {
      alert("Failed to delete the listing.");
    }
  };

  const onEditSubmit = async (data: EditValues) => {
    if (!editingApt) return;
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

      if (editImageFiles.length > 0) {
      editImageFiles.forEach((file) => formData.append("images", file));
    }

      await api.put(`/apartments/${editingApt.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditingApt(null);
      setEditingApt(null)
      fetchInventory();
      alert("Apartment modified successfully!");
    } catch (err: any) {
      setStatusMsg(err.response?.data?.message || "Failed to save profile specifications.");
    }
  };

  if (loading) return <div className="text-center py-10 text-sm text-gray-400">Syncing active assets...</div>;
    const closeEditModal = () => {
    setEditingApt(null);
    setEditImageFiles([]);
    };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-medium border-b border-gray-100">
                <th className="p-4">Listing Details</th>
                <th className="p-4">Type</th>
                <th className="p-4">Rate</th>
                <th className="p-4 text-right">Actions Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
              {apartments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-4">
                    <p className="text-gray-900 font-bold">{apt.title}</p>
                    <p className="text-xs text-gray-400">{apt.location}</p>
                  </td>
                  <td className="p-4 text-xs font-semibold text-gray-500">{apt.apartment_type}</td>
                  <td className="p-4 text-gray-900 font-bold">
                    {apt.currency === "USD" ? "$" : "₦"}{parseInt(apt.price).toLocaleString()}
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => startEdit(apt)} className="text-xs bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(apt.id)} className="text-xs bg-red-50 border border-red-100 text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingApt && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">Modify Suite: {editingApt.title}</h3>
              <button onClick={() => setEditingApt(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
            </div>

            {statusMsg && <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl text-center font-bold">{statusMsg}</div>}

            <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4 text-left">
                <div className="space-y-1.5">
                    <Label>Apartment Title</Label>
                    <Input {...register("title")} />
                    {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                    <Label>Rate Price</Label>
                    <Input type="number" {...register("price")} />
                    </div>
                    <div className="space-y-1.5">
                    <Label>Currency</Label>
                    <select {...register("currency")} className="w-full h-10 border rounded-xl px-3 text-sm bg-white outline-none">
                        <option value="NGN">NGN (₦)</option>
                        <option value="USD">USD ($)</option>
                    </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                    <Label>Location</Label>
                    <Input {...register("location")} />
                    </div>
                    <div className="space-y-1.5">
                    <Label>Property Variant Type</Label>
                    <Input {...register("apartment_type")} />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Amenities (Comma-separated)</Label>
                    <Input {...register("amenities")} />
                </div>

                <div className="space-y-1.5">
                    <Label>Description</Label>
                    <textarea rows={3} {...register("description")} className="w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none focus:border-gray-400" />
                </div>
                <div className="space-y-1.5 pt-2">
                    <Label className="font-semibold text-gray-900">Replace Gallery Images (Optional, Max 6)</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
                        <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleEditImageChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                        <p className="text-xs text-gray-500 font-medium">Click to pick replacement image attachments</p>
                        {editImageFiles.length > 0 && (
                        <p className="text-xs text-blue-600 font-bold mt-1">{editImageFiles.length} files staged to replace old listing media</p>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 pt-3 border-t">
                    <button type="button" onClick={() => setEditingApt(null)} className="flex-1 py-2.5 bg-gray-50 border text-gray-700 font-semibold text-sm rounded-xl">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-gray-900 text-white font-semibold text-sm rounded-xl disabled:opacity-50">
                    {isSubmitting ? "Updating..." : "Save Modifications"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

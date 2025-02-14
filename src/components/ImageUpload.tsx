"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  className?: string;
}

export default function ImageUpload({
  onUpload,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const file = event.target.files?.[0];
        if (!file) return;

        // Show preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        onUpload(data.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={uploading}
      />
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        {preview ? (
          <div className="relative w-full h-48">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="text-gray-500">
            {uploading ? "Uploading..." : "Click or drag image to upload"}
          </div>
        )}
      </div>
    </div>
  );
}

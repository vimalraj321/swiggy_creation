import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Handle both single and multiple file uploads
    const singleFile = formData.get("file") as File;
    const multipleFiles = formData.getAll("files") as File[];

    const files = singleFile ? [singleFile] : multipleFiles;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
              folder: "sugi_creations",
            },
            (error, result) => {
              if (error) reject(error);
              resolve(result?.secure_url);
            }
          )
          .end(buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);

    // For single file upload, return in the format expected by ImageUpload component
    if (singleFile) {
      return NextResponse.json({ secure_url: urls[0] });
    }

    // For multiple files, return array of URLs
    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Error in upload route:", error);
    return NextResponse.json(
      { error: "Error uploading files" },
      { status: 500 }
    );
  }
}

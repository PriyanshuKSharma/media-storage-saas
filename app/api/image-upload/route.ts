import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
}

// Function to upload file to Cloudinary
async function uploadFileToCloudinary(buffer: Buffer): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "next-cloudinary-uploads" },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve(result);
                } else {
                    reject(new Error("Upload failed without error response"));
                }
            }
        );

        uploadStream.end(buffer);
    });
}

// API Route to Handle Upload
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Validate Cloudinary Configuration
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return new NextResponse("Cloudinary configuration error", { status: 500 });
        }

        // Extract file from form data
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 400 });
        }

        // Convert file to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload the file to Cloudinary
        const result = await uploadFileToCloudinary(buffer);

        return NextResponse.json(
            {
                publicId: result.public_id,
                url: result.secure_url,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

// Define various social media image formats with their respective dimensions and aspect ratios
const socialFormats = {
    "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
    "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
    "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
    "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
    "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

// Define the type for the social formats based on the keys of socialFormats
type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
    // State for storing the uploaded image
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    // State for tracking the selected social media format
    const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");

    // State for tracking if an image is being uploaded
    const [isUploading, setIsUploading] = useState(false);

    // State for tracking if an image is being transformed
    const [isTransforming, setIsTransforming] = useState(false);

    // Reference to store the image element for downloading
    const imageRef = useRef<HTMLImageElement>(null);

    // useEffect to set the transforming state whenever the uploaded image or format changes
    useEffect(() => {
        if (uploadedImage) {
            setIsTransforming(true);
        }
    }, [selectedFormat, uploadedImage]);

    // Function to handle file upload
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Get the uploaded file
        if (!file) return;
        setIsUploading(true); // Start uploading state

        const formData = new FormData();
        formData.append("file", file); // Append file to formData

        try {
            // Send the file to the server endpoint for uploading
            const response = await fetch("/api/image-upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to upload image");

            const data = await response.json();
            setUploadedImage(data.publicId); // Store the uploaded image's public ID
        } catch (error) {
            console.log(error);
            alert("Failed to upload image");
        } finally {
            setIsUploading(false); // Stop uploading state
        }
    };

    // Function to handle image download
    const handleDownload = () => {
        if (!imageRef.current) return;

        fetch(imageRef.current.src) // Fetch the image source
            .then((response) => response.blob()) // Convert response to blob
            .then((blob) => {
                const url = window.URL.createObjectURL(blob); // Create a download URL
                const link = document.createElement("a");
                link.href = url;
                link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`; // Set filename
                document.body.appendChild(link);
                link.click(); // Trigger the download
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url); // Revoke URL to free memory
            });
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            {/* Title */}
            <h1 className="text-3xl font-bold mb-6 text-center">
                Social Media Image Creator
            </h1>

            {/* Card Container */}
            <div className="card">
                <div className="card-body">
                    {/* Upload Image Section */}
                    <h2 className="card-title mb-4">Upload an Image</h2>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Choose an image file</span>
                        </label>
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className="file-input file-input-bordered file-input-primary w-full"
                        />
                    </div>

                    {/* Show Uploading Progress */}
                    {isUploading && (
                        <div className="mt-4">
                            <progress className="progress progress-primary w-full"></progress>
                        </div>
                    )}

                    {/* Image Transformation Section */}
                    {uploadedImage && (
                        <div className="mt-6">
                            {/* Select Format Dropdown */}
                            <h2 className="card-title mb-4">Select Social Media Format</h2>
                            <div className="form-control">
                                <select
                                    className="select select-bordered w-full"
                                    value={selectedFormat}
                                    onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                                >
                                    {Object.keys(socialFormats).map((format) => (
                                        <option key={format} value={format}>
                                            {format}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Image Preview Section */}
                            <div className="mt-6 relative">
                                <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                                <div className="flex justify-center">
                                    {/* Show Loading Spinner While Transforming */}
                                    {isTransforming && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                                            <span className="loading loading-spinner loading-lg"></span>
                                        </div>
                                    )}

                                    {/* Render Transformed Image */}
                                    <CldImage
                                        width={socialFormats[selectedFormat].width}
                                        height={socialFormats[selectedFormat].height}
                                        src={uploadedImage}
                                        sizes="100vw"
                                        alt="transformed image"
                                        crop="fill"
                                        aspectRatio={socialFormats[selectedFormat].aspectRatio}
                                        gravity="auto"
                                        ref={imageRef}
                                        onLoad={() => setIsTransforming(false)} // Stop transformation loader when image loads
                                    />
                                </div>
                            </div>

                            {/* Download Button */}
                            <div className="card-actions justify-center sm:justify-end mt-6">
                                <button 
                                    className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto gap-2 shadow-md hover:shadow-lg transition-all duration-300 text-black font-medium rounded-lg px-6 py-2.5 flex items-center justify-center"
                                    onClick={handleDownload}
                                    disabled={isTransforming}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" x2="12" y1="15" y2="3"></line>
                                    </svg>
                                    <span className="text-black">{isTransforming ? 'Processing...' : 'Download'}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
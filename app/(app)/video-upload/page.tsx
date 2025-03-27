"use client" 
// This ensures the component runs in a client-side environment in Next.js.

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Functional component for video upload
function VideoUpload() {
    // State variables to manage file, title, description, and upload status
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Router hook for navigation
    const router = useRouter();

    // Define maximum allowed file size (70MB)
    const MAX_FILE_SIZE = 70 * 1024 * 1024;

    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents page refresh on form submission

        if (!file) return; // Exit if no file is selected

        // Check if the file size exceeds the limit
        if (file.size > MAX_FILE_SIZE) {
            alert("File size too large"); // Show an alert if file is too large
            return;
        }

        setIsUploading(true); // Set uploading state to true

        // Create FormData to send file and other details
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("originalSize", file.size.toString());

        try {
            // Send a POST request to upload the video
            const response = await axios.post("/api/video-upload", formData);

            // Redirect to home page on successful upload
            router.push("/");
        } catch (error) {
            console.log(error); // Log error in case of failure
            // TODO: Implement notification for failure
        } finally {
            setIsUploading(false); // Reset uploading state
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
            
            {/* Form for uploading video */}
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Input field for video title */}
                <div>
                    <label className="label">
                        <span className="label-text">Title</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                {/* Input field for video description */}
                <div>
                    <label className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="textarea textarea-bordered w-full"
                    />
                </div>

                {/* Input field for video file selection */}
                <div>
                    <label className="label">
                        <span className="label-text">Video File</span>
                    </label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="file-input file-input-bordered w-full"
                        required
                    />
                </div>

                {/* Upload button, disabled while uploading */}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Upload Video"}
                </button>
            </form>
        </div>
    );
}

export default VideoUpload;

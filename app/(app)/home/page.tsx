"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";

function Home() {
    // State for storing videos
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // Function to fetch videos from the API
    const fetchVideos = useCallback(async () => {
        try {
            const response = await axios.get("/api/videos");
            if (Array.isArray(response.data)) {
                setVideos(response.data); // Set videos if response is valid
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.error(error);
            setError("Failed to fetch videos"); // Set error message
        } finally {
            setLoading(false); // Stop loading state
        }
    }, []);

    // Fetch videos on component mount
    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    // Function to handle video download
    const handleDownload = useCallback((url: string, title: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.mp4`);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    // Show loading state
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex h-screen">
            {/* Main Content */}
            <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
                <div className="bg-gray-100 p-4 shadow-md flex items-center justify-between">
                    <h1 className="text-xl font-bold">Home</h1>
                </div>

                {/* Videos Section */}
                <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Videos</h1>
                    {videos.length === 0 ? (
                        <div className="text-center text-lg text-gray-500">
                            No videos available
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    onDownload={handleDownload}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
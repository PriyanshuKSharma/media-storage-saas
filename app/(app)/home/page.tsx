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

    // Show loading state
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Your Videos</h1>
            {videos.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">No videos uploaded yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <VideoCard 
                            key={video.id} 
                            video={video} 
                            onDownload={(url, title) => {
                                // Implement download functionality
                                window.open(url, '_blank');
                            }} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
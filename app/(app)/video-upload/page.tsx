"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function VideoUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const router = useRouter();
    const MAX_FILE_SIZE = 70 * 1024 * 1024;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            alert("File size too large");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("originalSize", file.size.toString());

        try {
            await axios.post("/api/video-upload", formData);
            router.push("/");
        } catch (error) {
            console.log(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out`}
            >
                {/* <div className="p-4">
                    <h2 className="text-2xl font-bold">Sidebar</h2>
                    <ul className="mt-4 space-y-2">
                        <li>
                            <a href="/home" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                Home Page
                            </a>
                        </li>
                        <li>
                            <a href="/social-share" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                Social Share
                            </a>
                        </li>
                        <li>
                            <a href="/video-upload" className="block px-4 py-2 bg-primary text-white rounded">
                                Video Upload
                            </a>
                        </li>
                    </ul>
                </div> */}
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
                {/* <div className="bg-gray-100 p-4 shadow-md flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-800 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-menu"
                        >
                            <line x1="4" y1="12" x2="20" y2="12"></line>
                            <line x1="4" y1="6" x2="20" y2="6"></line>
                            <line x1="4" y1="18" x2="20" y2="18"></line>
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold">Video Upload</h1>
                </div> */}

                {/* Form */}
                <div className="container mx-auto max-w-lg p-6 bg-white shadow-md rounded-lg mt-6">
                    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                        Upload Your Video
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">Title</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input input-bordered w-full bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter video title"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">Description</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="textarea textarea-bordered w-full bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter video description"
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">Video File</span>
                            </label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="file-input file-input-bordered w-full bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={`bg-blue-500 hover:bg-blue-600 text-black font-semibold w-full py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                                isUploading ? "relative overflow-hidden" : ""
                            }`}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </span>
                                    <div className="absolute bottom-0 left-0 h-1 bg-blue-300 animate-pulse" style={{ width: '100%' }}></div>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                    Upload Video
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VideoUpload;
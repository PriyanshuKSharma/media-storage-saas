import React, { useState, useEffect, useCallback } from 'react';
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp, Play, Share2 } from "lucide-react";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from '@prisma/client';

dayjs.extend(relativeTime);

interface VideoCardProps {
    video: {
        id: string;
        title: string;
        publicId: string;
        createdAt: string;
        size: number;
        originalSize: number;
        compressedSize: number;
        duration: number;
        description?: string;
    };
    onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
    const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>('idle');
    const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'error'>('idle');

    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 225,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
            assetType: "video"
        })
    }, [])

    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 1920,
            height: 1080,

        })
    }, [])

    const formatSize = useCallback((size: number) => {
        return filesize(size)
    }, [])

    const formatDuration = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }, []);

    const compressionPercentage = Math.round(
        (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
    );

    const handleShare = useCallback(() => {
        const shareUrl = window.location.origin + '/video/' + video.id;
        
        try {
            navigator.clipboard.writeText(shareUrl);
            setShareStatus('copied');
            
            // Reset status after 2 seconds
            setTimeout(() => {
                setShareStatus('idle');
            }, 2000);
        } catch (error) {
            console.error('Failed to copy link:', error);
            setShareStatus('error');
            
            // Reset status after 2 seconds
            setTimeout(() => {
                setShareStatus('idle');
            }, 2000);
        }
    }, [video.id]);
    
    const handleDownload = useCallback(async () => {
        try {
            setDownloadStatus('downloading');
            
            const url = getFullVideoUrl(video.publicId);
            
            // Try using the provided onDownload callback
            if (typeof onDownload === 'function') {
                try {
                    await onDownload(url, video.title);
                    setDownloadStatus('idle');
                    return;
                } catch (error) {
                    console.error('Parent download handler failed:', error);
                    // Continue with fallback
                }
            }
            
            // Fallback: Direct download implementation
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch video');
            }
            
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${video.title || 'video'}.mp4`;
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            }, 100);
            
            setDownloadStatus('idle');
        } catch (error) {
            console.error('Download failed:', error);
            setDownloadStatus('error');
            
            // Reset status after 2 seconds
            setTimeout(() => {
                setDownloadStatus('idle');
            }, 2000);
        }
    }, [video.publicId, video.title, onDownload, getFullVideoUrl]);

    return (
        <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-lg border border-base-200">
            {/* Thumbnail/Video section */}
            <figure className="aspect-video relative group">
                <div className="relative w-full h-full">
                    <img
                        src={getThumbnailUrl(video.publicId)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            className="btn btn-circle btn-sm btn-primary shadow-md hover:scale-105 transition-transform"
                            onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}
                            aria-label="Play video"
                        >
                            <Play size={18} />
                        </button>
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-base-100 bg-opacity-90 px-2 py-0.5 rounded text-xs flex items-center z-10 shadow-sm">
                    <Clock size={10} className="mr-1" />
                    {formatDuration(video.duration)}
                </div>
            </figure>
            
            {/* Card content - more compact */}
            <div className="p-3">
                <h2 className="font-medium line-clamp-1 text-sm">{video.title}</h2>
                
                {video.description && (
                    <p className="text-xs text-base-content/70 line-clamp-1 mt-0.5">
                        {video.description}
                    </p>
                )}
                
                <div className="flex items-center gap-2 mt-1 text-xs text-base-content/60">
                    <Clock size={10} />
                    <span>{dayjs(video.createdAt).fromNow()}</span>
                </div>

                {/* Compression data - simplified */}
                <div className="mt-2 bg-base-200/50 rounded p-1.5">
                    <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-medium">Compression</span>
                        <span className="text-accent font-bold">{compressionPercentage}%</span>
                    </div>
                    <div className="w-full bg-base-300 rounded-full h-1">
                        <div 
                            className="bg-primary h-1 rounded-full transition-all duration-500" 
                            style={{width: `${compressionPercentage}%`}}
                        ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs mt-1">
                        <div className="flex items-center">
                            <FileUp size={9} className="mr-0.5 text-primary/80" />
                            <span>{formatSize(Number(video.originalSize))}</span>
                        </div>
                        <div className="flex items-center">
                            <FileDown size={9} className="mr-0.5 text-accent" />
                            <span>{formatSize(Number(video.compressedSize))}</span>
                        </div>
                    </div>
                </div>

                {/* Action buttons - more compact with icons only */}
                <div className="mt-2 pt-1 border-t border-base-200 flex justify-between items-center">
                    {/* Left side: utility buttons */}
                    <div className="flex items-center gap-1">
                        <button
                            className={`btn btn-xs btn-circle ${
                                shareStatus === 'copied' ? 'btn-success' : 
                                shareStatus === 'error' ? 'btn-error' : 'btn-ghost'
                            }`}
                            onClick={handleShare}
                            disabled={shareStatus !== 'idle'}
                            aria-label="Share"
                        >
                            {shareStatus === 'idle' && <Share2 size={14} />}
                            {shareStatus === 'copied' && <span>✓</span>}
                            {shareStatus === 'error' && <span>✗</span>}
                        </button>
                        
                        <button
                            className={`btn btn-xs btn-circle ${
                                downloadStatus === 'downloading' ? 'btn-disabled' :
                                downloadStatus === 'error' ? 'btn-error' : 'btn-ghost'
                            }`}
                            onClick={handleDownload}
                            disabled={downloadStatus !== 'idle'}
                            aria-label="Download"
                        >
                            {downloadStatus === 'idle' && <Download size={14} />}
                            {downloadStatus === 'downloading' && (
                                <span className="loading loading-spinner loading-xs"></span>
                            )}
                            {downloadStatus === 'error' && <span>✗</span>}
                        </button>
                    </div>
                    
                    {/* Right side: primary action */}
                    <button
                        className="btn btn-xs btn-primary btn-circle"
                        onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}
                        aria-label="Play video"
                    >
                        <Play size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
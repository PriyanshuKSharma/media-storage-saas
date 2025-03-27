type Video = {
    title: string;
    id: string;
    description: string | null;
    publicId: string;
    originalSize: string; // Ensure this matches the expected type
    url: string;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
    compressedSize: string;
    userId: string;
};

export type { Video }; // Use 'export type' for type exports
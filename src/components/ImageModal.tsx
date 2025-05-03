import React from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
    imageUrl: string;
    alt: string;
    onClose: () => void;
}

export function ImageModal({ imageUrl, alt, onClose }: ImageModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-0 top-0 m-4 p-2 text-white hover:text-gray-300 z-10"
                >
                    <X className="h-6 w-6" />
                </button>
                <img
                    src={imageUrl}
                    alt={alt}
                    className="max-w-full max-h-screen object-contain rounded-lg"
                />
            </div>
        </div>
    );
}

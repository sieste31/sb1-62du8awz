'use client';

import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { validateImage } from '@/lib/imageUtils';

interface BatteryDetailImageProps {
    imageUrl: string | null;
    batteryGroup: {
        type: string;
    };
    setSelectedImage: (image: string) => void;
    setShowCropper: (show: boolean) => void;
    setError: (error: string) => void;
}

export function BatteryDetailImage({ imageUrl, batteryGroup, setSelectedImage, setShowCropper, setError }: BatteryDetailImageProps){
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        try {
            // 画像のバリデーション
            validateImage(file);

            // 画像をData URLに変換
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('画像選択エラー:', err);
            setError(err instanceof Error ? err.message : '画像の選択に失敗しました');
        }
    };


    return (
        <div className="flex-shrink-0">
            <div className="relative group">
                <img
                    src={imageUrl || ''}
                    alt={`${batteryGroup.type}の画像`}
                    className="w-32 h-32 rounded-lg object-cover"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                >
                    <Upload className="h-6 w-6 text-white" />
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                />
            </div>
        </div>
    );
};

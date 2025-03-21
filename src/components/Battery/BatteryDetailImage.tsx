// 電池詳細画面の画像を表示・アップロードするコンポーネント

'use client';

import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { validateImage, compressImage } from '@/lib/imageUtils';
import { supabase } from '@/lib/supabase';
import { ImageCropper } from '@/components/ImageCropper';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';

interface BatteryDetailImageProps {
    imageUrl: string | null;
    batteryGroup: {
        id: string;
        type: string;
        image_url?: string | null;
    };
    setError: (error: string | null) => void;
}

export function BatteryDetailImage({ 
    imageUrl, 
    batteryGroup, 
    setError 
}: BatteryDetailImageProps) {
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

    const handleCropComplete = async (croppedBlob: Blob) => {
        if (!user) return;

        try {
            // 圧縮処理
            const compressedFile = await compressImage(croppedBlob, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
            });

            const fileExt = compressedFile.name.split('.').pop();
            const filePath = `${user.id}/${batteryGroup.id}/image.${fileExt}`;

            // まず既存の画像を削除
            if (batteryGroup.image_url) {
                const existingPath = batteryGroup.image_url.split('/').slice(-3).join('/');
                await supabase.storage
                    .from('battery-images')
                    .remove([existingPath]);
            }

            // 新しい画像をアップロード
            const { error: uploadError } = await supabase.storage
                .from('battery-images')
                .upload(filePath, compressedFile, { upsert: true });

            if (uploadError) throw uploadError;

            const { error: updateError } = await supabase
                .from('battery_groups')
                .update({ image_url: filePath })
                .eq('id', batteryGroup.id);

            if (updateError) throw updateError;

            // クロッパーを閉じて画面を更新
            setShowCropper(false);
            setSelectedImage(null);
            window.location.reload();
        } catch (err) {
            console.error('画像アップロード処理エラー:', err);
            setError(err instanceof Error ? err.message : '画像のアップロードに失敗しました');
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

            {/* Image Cropper */}
            {showCropper && selectedImage && (
                <ImageCropper
                    image={selectedImage}
                    onClose={() => {
                        setShowCropper(false);
                        setSelectedImage(null);
                    }}
                    onCropComplete={handleCropComplete}
                />
            )}
        </div>
    );
}

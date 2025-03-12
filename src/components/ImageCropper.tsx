import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperProps {
  image: string;
  onClose: () => void;
  onCropComplete: (croppedImage: Blob) => Promise<void>;
}

export function ImageCropper({ image, onClose, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const onCropChange = (location: Point) => {
    setCrop(location);
  };

  const onZoomChange = (value: number) => {
    setZoom(value);
  };

  const onCropAreaChange = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // キャンバスのサイズを設定（正方形）
    const size = Math.min(pixelCrop.width, pixelCrop.height);
    canvas.width = size;
    canvas.height = size;

    // 画像を描画
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      size,
      size,
      0,
      0,
      size,
      size
    );

    // キャンバスから画像を生成
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg', 0.95);
    });
  };

  const handleSave = async () => {
    if (loading || !croppedAreaPixels) return;

    try {
      setLoading(true);
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      await onCropComplete(croppedImage);
    } catch (err) {
      console.error('画像の切り抜きに失敗しました:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center">
        <div className="relative w-full max-w-3xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-0 top-0 m-4 p-2 text-white hover:text-gray-300 z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Cropper */}
          <div className="relative h-96 w-full">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropAreaChange}
            />
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <label htmlFor="zoom" className="mr-2 text-white">
                拡大
              </label>
              <input
                type="range"
                id="zoom"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => onZoomChange(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '処理中...' : '切り抜く'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
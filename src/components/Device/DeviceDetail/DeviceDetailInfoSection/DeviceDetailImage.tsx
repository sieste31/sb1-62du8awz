import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { useAuth } from '@/lib/auth-provider';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';
import { ImageModal } from '@/components/ImageModal';

type Device = Database['public']['Tables']['devices']['Row'];

interface DeviceDetailImageProps {
  device: Device;
}

export function DeviceDetailImage({ device }: DeviceDetailImageProps) {
  const { t } = useTranslation();
  const imageUrl = useDeviceDetailStore(state => state.imageUrl);
  const handleImageSelect = useDeviceDetailStore(state => state.handleImageSelect);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { isEditing, setShowCropper, setSelectedImage } = useDeviceDetailStore();
  const [showImageModal, setShowImageModal] = React.useState(false);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    await handleImageSelect(file, user.id);
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    } else if (imageUrl) {
      setShowImageModal(true);
    }
  };

  return (
    <div className="flex-shrink-0">
      <div className="relative group">
        <img
          src={imageUrl || ''}
          alt={t('device.detail.imageAlt', { name: device.name })}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover cursor-pointer"
          onClick={handleImageClick}
        />
        {isEditing && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
          >
            <Upload className="h-6 w-6 text-white" />
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {/* Image Modal */}
      {showImageModal && imageUrl && (
        <ImageModal
          imageUrl={imageUrl}
          alt={t('device.detail.imageAlt', { name: device.name })}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </div>
  );
}

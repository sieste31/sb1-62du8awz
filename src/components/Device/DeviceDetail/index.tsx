// デバイス詳細画面を表示するコンポーネント

import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDevice } from '@/lib/hooks';
import { DeviceUsageHistory } from '../DeviceUsageHistory';
import { getDeviceImage } from '@/lib/deviceImages';
import { ImageCropper } from '@/components/ImageCropper';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { DeviceDetailInfo } from './DeviceDetailInfoSection';
import { DeviceDetailBatterySection } from './DeviceDetailBatterySection';
import { useTranslation } from 'react-i18next';

export function DeviceDetail() {
  const { t } = useTranslation();
  const { id: urlId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { device, batteries, loading } = useDevice(urlId || '');
  
  // Zustandストアから状態と関数を取得
  const {
    id: storeId, setId,
    editData, initializeEditData,
    error, setError,
    imageUrl, setImageUrl,
    showHistory,
    selectedImage, showCropper,
    setIsEditing
  } = useDeviceDetailStore();

  // 初期データをセット
  useEffect(() => {
    if (urlId && urlId !== storeId) {
      setId(urlId);
    }
  }, [urlId, storeId, setId]);

  // デバイスデータが取得できたら編集データを初期化
  useEffect(() => {
    if (device && urlId === storeId) {
      // デバイスが変更された場合のみeditDataを初期化
      initializeEditData(device);
      setIsEditing(false);
      
      // 画像URLを取得
      getDeviceImage(device.type as 'remotecontroller' | 'speaker' | 'camera' | 'gadget' | 'light' | 'toy' | 'other', device.image_url)
        .then(url => setImageUrl(url));
    }
  }, [device, storeId, urlId, initializeEditData, setImageUrl, setIsEditing]);

  if (loading || !device || !editData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // handleCropCompleteのラッパー関数
  const handleCropCompleteWrapper = (croppedBlob: Blob) => {
    return useDeviceDetailStore.getState().handleCropComplete(croppedBlob, device.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 戻るボタン */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/devices')}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('device.detail.backToList')}
          </button>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        {/* デバイス詳細画面　ヘッダー部分 */}
        <DeviceDetailInfo device={device} batteries={batteries} />

        {/* デバイス詳細画面　電池一覧部分 */}
        <DeviceDetailBatterySection device={device} batteries={batteries} />



        <DeviceUsageHistory
          isOpen={showHistory}
          onClose={() => useDeviceDetailStore.getState().setShowHistory(false)}
          deviceId={device.id}
          deviceName={device.name}
        />

        {showCropper && selectedImage && (
          <ImageCropper
            image={selectedImage}
            onClose={() => {
              useDeviceDetailStore.getState().setShowCropper(false);
              useDeviceDetailStore.getState().setSelectedImage(null);
            }}
            onCropComplete={handleCropCompleteWrapper}
          />
        )}
      </div>
    </div>
  );
}

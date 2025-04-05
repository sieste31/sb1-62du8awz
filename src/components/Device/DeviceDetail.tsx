// デバイス詳細画面を表示するコンポーネント

import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDevice } from '@/lib/hooks';
import { DeviceUsageHistory } from './DeviceUsageHistory';
import { getDeviceImage } from '@/lib/deviceImages';
import { ImageCropper } from '@/components/ImageCropper';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { DeviceDetailElemHead } from './DeviceDetailElemHead';
import { DeviceDetailImage } from './DeviceDetailImage';
import { DeviceDetailElemType } from './DeviceDetailElemType';
import { DeviceDetailElemBatteryShape } from './DeviceDetailElemBatteryShape';
import { DeviceDetailElemBatteryCount } from './DeviceDetailElemBatteryCount';
import { DeviceDetailElemBatteryLife } from './DeviceDetailElemBatteryLife';
import { DeviceDetailElemPurchaseDate } from './DeviceDetailElemPurchaseDate';
import { DeviceDetailElemLastChange } from './DeviceDetailElemLastChange';
import { DeviceDetailElemNotes } from './DeviceDetailElemNotes';
import { DeviceDetailBatterySection } from './DeviceDetailBatterySection';

export function DeviceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { device, batteries, loading } = useDevice(id || '');
  
  // Zustandストアから状態と関数を取得
  const {
    editData, initializeEditData,
    error, setError,
    imageUrl, setImageUrl,
    showHistory,
    selectedImage, showCropper,
    handleCropComplete,
    setDevice, setBatteries,
    setIsEditing
  } = useDeviceDetailStore();

  // 初期データをセット
  useEffect(() => {
    if (device) {
      console.log('useDevice batteries:', batteries);
      
      // 常にeditDataを初期化して、編集モードをリセット
      initializeEditData(device);
      setIsEditing(false);
      
      // deviceの更新
      const currentDevice = useDeviceDetailStore.getState().device;
      if (!currentDevice || currentDevice.id !== device.id) {
        setDevice(device);
        
        // 画像URLを取得
        getDeviceImage(device.type, device.image_url)
          .then(url => setImageUrl(url));
      }
      
      // batteriesの更新（deviceが変更されなくても常に最新のbatteriesを反映）
      if (batteries && batteries.length > 0) {
        setBatteries(batteries);
        console.log('After setBatteries, store batteries:', useDeviceDetailStore.getState().batteries);
      } else {
        console.log('batteries is empty or undefined');
        // 空の場合も明示的に空の配列を設定
        setBatteries([]);
      }
    }
  }, [id, device, batteries, setDevice, setBatteries, initializeEditData, setImageUrl, setIsEditing]);

  if (loading || !device || !editData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/devices')}
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <DeviceDetailElemHead />

          <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
            <div className="flex flex-row space-x-4">
              <div className="flex-shrink-0">
                <DeviceDetailImage />
              </div>
              <div className="flex-1 min-w-0">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-3 sm:grid-cols-2">
                  <DeviceDetailElemType />
                  <DeviceDetailElemBatteryShape />
                  <DeviceDetailElemBatteryCount />
                  <DeviceDetailElemPurchaseDate />
                  <DeviceDetailElemBatteryLife />
                  <DeviceDetailElemLastChange />
                </dl>
              </div>
            </div>
            <div className="mt-6">
              <DeviceDetailElemNotes />
            </div>
          </div>
        </div>

        <DeviceDetailBatterySection />

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

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
            onCropComplete={handleCropComplete}
          />
        )}
      </div>
    </div>
  );
}

// デバイス詳細画面を表示するコンポーネント

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Speaker, Camera, Gamepad, Lightbulb, ArrowLeft, Battery, Pencil, X, Check, History, Upload, ToyBrick, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-provider';
import { useDevice, invalidateQueries } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { DeviceBatterySlot } from './DeviceBatterySlot';
import { DeviceUsageHistory } from './DeviceUsageHistory';
import { getDeviceImage } from '@/lib/deviceImages';
import { compressImage, validateImage } from '@/lib/imageUtils';
import { ImageCropper } from '@/components/ImageCropper';
import type { Database } from '@/lib/database.types';

type Device = Database['public']['Tables']['devices']['Row'];
type Battery = Database['public']['Tables']['batteries']['Row'] & {
  battery_groups?: Database['public']['Tables']['battery_groups']['Row'];
};

const deviceTypeIcons = {
  smartphone: Smartphone,
  speaker: Speaker,
  camera: Camera,
  gadget: Gamepad,
  light: Lightbulb,
  toy: ToyBrick,
};

interface DeviceDetailProps {
  id: string;
}

export function DeviceDetail({ id }: DeviceDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { device, batteries, loading } = useDevice(id);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    name: string;
    type: Device['type'];
    batteryType: string;
    batteryCount: number;
    batteryLifeWeeks: string | number;
    purchaseDate: string;
    notes: string;
  } | null>(null);

  useEffect(() => {
    if (device) {
      setEditData({
        name: device.name,
        type: device.type,
        batteryType: device.battery_type,
        batteryCount: device.battery_count,
        batteryLifeWeeks: device.battery_life_weeks || '',
        purchaseDate: device.purchase_date || '',
        notes: device.notes || '',
      });

      getDeviceImage(device.type as keyof typeof deviceTypeIcons, device.image_url)
        .then(url => setImageUrl(url));
    }
  }, [device, isEditing]);

  if (loading || !device || !editData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const DeviceIcon = deviceTypeIcons[device.type as keyof typeof deviceTypeIcons];

  const calculateBatteryEndDate = () => {
    if (!device.last_battery_change || !device.battery_life_weeks) return null;
    const lastChange = new Date(device.last_battery_change);
    const endDate = new Date(lastChange);
    endDate.setDate(endDate.getDate() + (device.battery_life_weeks * 7));
    return endDate;
  };

  const batteryEndDate = calculateBatteryEndDate();
  const isNearingEnd = batteryEndDate && (new Date(batteryEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 7;

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      validateImage(file);

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
    if (!user || !device) return;

    try {
      const compressedFile = await compressImage(croppedBlob, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
      });

      const fileExt = compressedFile.name.split('.').pop();
      const filePath = `${user.id}/${device.id}/image.${fileExt}`;

      if (device.image_url) {
        const existingPath = device.image_url.split('/').slice(-3).join('/');
        await supabase.storage
          .from('device-images')
          .remove([existingPath]);
      }

      const { error: uploadError } = await supabase.storage
        .from('device-images')
        .upload(filePath, compressedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('devices')
        .update({ image_url: filePath })
        .eq('id', device.id);

      if (updateError) throw updateError;

      setShowCropper(false);
      setSelectedImage(null);
      window.location.reload();
    } catch (err) {
      console.error('画像アップロード処理エラー:', err);
      setError(err instanceof Error ? err.message : '画像のアップロードに失敗しました');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('devices')
        .update({
          name: editData.name,
          type: editData.type,
          battery_type: editData.batteryType,
          battery_count: editData.batteryCount,
          battery_life_weeks: editData.batteryLifeWeeks ? Number(editData.batteryLifeWeeks) : null,
          purchase_date: editData.purchaseDate || null,
          notes: editData.notes || null,
        })
        .eq('id', device.id);

      if (updateError) throw updateError;

      const { invalidateDevices } = invalidateQueries(queryClient);
      await invalidateDevices();

      setIsEditing(false);
      setSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      name: device.name,
      type: device.type,
      batteryType: device.battery_type,
      batteryCount: device.battery_count,
      batteryLifeWeeks: device.battery_life_weeks || '',
      purchaseDate: device.purchase_date || '',
      notes: device.notes || '',
    });
    setIsEditing(false);
  };

  const installedCount = batteries.length;
  const hasBatteriesInstalled = installedCount > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/devices')}
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DeviceIcon className="h-6 w-6 text-gray-400 mr-3" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-gray-900">
                    {device.name}
                  </h2>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  登録日: {new Date(device.created_at).toLocaleDateString()}
                </div>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center p-2 border border-transparent rounded-full text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
            <div className="flex space-x-6">
              <div className="flex-shrink-0">
                <div className="relative group">
                  <img
                    src={imageUrl || ''}
                    alt={`${device.name}の画像`}
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
              <div className="flex-1">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      デバイスタイプ
                    </dt>
                    <dd className="mt-1">
                      {isEditing ? (
                        <select
                          value={editData.type}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              type: e.target.value as Device['type'],
                            })
                          }
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="smartphone">
                            スマートフォン/リモコン
                          </option>
                          <option value="speaker">スピーカー</option>
                          <option value="camera">カメラ</option>
                          <option value="gadget">ガジェット</option>
                          <option value="light">ライト</option>
                          <option value="toy">おもちゃ</option>
                        </select>
                      ) : (
                        <span className="text-sm text-gray-900">
                          {device.type === 'smartphone'
                            ? 'スマートフォン/リモコン'
                            : device.type === 'speaker'
                            ? 'スピーカー'
                            : device.type === 'gadget'
                            ? 'ガジェット'
                            : device.type === 'light'
                            ? 'ライト'
                            : device.type === 'toy'
                            ? 'おもちゃ'
                            : 'カメラ'}
                        </span>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">使用電池</dt>
                    <dd className="mt-1">
                      {isEditing ? (
                        <div>
                          <select
                            value={editData.batteryType}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                batteryType: e.target.value,
                              })
                            }
                            disabled={hasBatteriesInstalled}
                            className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              hasBatteriesInstalled ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                          >
                            <option value="単1形">単1形</option>
                            <option value="単2形">単2形</option>
                            <option value="単3形">単3形</option>
                            <option value="単4形">単4形</option>
                            <option value="9V形">9V形</option>
                          </select>
                          {hasBatteriesInstalled && (
                            <p className="mt-1 text-xs text-amber-600">
                              電池が設定されているため変更できません
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-900">
                          {device.battery_type}
                        </span>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">必要本数</dt>
                    <dd className="mt-1">
                      {isEditing ? (
                        <div>
                          <input
                            type="number"
                            min="1"
                            value={editData.batteryCount}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                batteryCount: parseInt(e.target.value),
                              })
                            }
                            disabled={hasBatteriesInstalled}
                            className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              hasBatteriesInstalled ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                          />
                          {hasBatteriesInstalled && (
                            <p className="mt-1 text-xs text-amber-600">
                              電池が設定されているため変更できません
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-900">
                          {device.battery_count}本
                        </span>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">電池寿命（週）</dt>
                    <dd className="mt-1">
                      {isEditing ? (
                        <div className="relative rounded-md shadow-sm">
                          <input
                            type="number"
                            min="1"
                            value={editData.batteryLifeWeeks}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                batteryLifeWeeks: e.target.value,
                              })
                            }
                            className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-8"
                            placeholder="例: 12"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">週</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-900">
                          {device.battery_life_weeks ? `${device.battery_life_weeks}週` : '---'}
                        </span>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">購入日</dt>
                    <dd className="mt-1">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editData.purchaseDate}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              purchaseDate: e.target.value,
                            })
                          }
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {device.purchase_date
                            ? new Date(device.purchase_date).toLocaleDateString()
                            : '---'}
                        </span>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">最終電池交換日</dt>
                    <dd className="mt-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">
                          {device.last_battery_change
                            ? new Date(device.last_battery_change).toLocaleDateString()
                            : '---'}
                        </span>
                        {batteryEndDate && (
                          <div className={`flex items-center text-sm ${
                            isNearingEnd ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              交換予定: {batteryEndDate.toLocaleDateString()}
                              {isNearingEnd && ' (まもなく交換時期)'}
                            </span>
                          </div>
                        )}
                      </div>
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">メモ</dt>
                    <dd className="mt-1">
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={editData.notes}
                          onChange={(e) =>
                            setEditData({ ...editData, notes: e.target.value })
                          }
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {device.notes || '---'}
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">電池の設定</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  設置済み: {installedCount}本 / 未設置:{' '}
                  {device.battery_count - installedCount}本
                </span>
                <button
                  onClick={() => setShowHistory(true)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <History className="h-4 w-4 mr-1" />
                  交換履歴
                </button>
                <Link
                  href={`/devices/${device.id}/select-battery`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Battery className="h-4 w-4 mr-2" />
                  電池を設定
                </Link>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {batteries.map((battery, index) => (
              <DeviceBatterySlot
                key={battery.id}
                slotNumber={index + 1}
                battery={battery}
              />
            ))}
            {Array.from({ length: device.battery_count - batteries.length }).map((_, index) => (
              <DeviceBatterySlot
                key={`empty-${index}`}
                slotNumber={batteries.length + index + 1}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <DeviceUsageHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          deviceId={device.id}
          deviceName={device.name}
        />

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
    </div>
  );
}
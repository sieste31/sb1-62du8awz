// デバイス作成画面のコンポーネント

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Radio, Camera, Lightbulb, Gamepad, ArrowLeft, ToyBrick, AlertCircle, HelpCircle, Upload } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { useDevices, useUserPlan } from '@/lib/hooks';
import { createDevice } from '@/lib/api';
import { uploadDeviceImage } from '@/lib/api/storage';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';
import { validateImage } from '@/lib/imageUtils';
import { ImageCropper } from '@/components/ImageCropper';

type DeviceType = Database['public']['Tables']['devices']['Row']['type'];


export function DeviceForm() {
  const { t } = useTranslation();

  const deviceTypeOptions = [
    { value: 'remotecontroller', label: t('device.types.remotecontroller'), icon: Smartphone },
    { value: 'speaker', label: t('device.types.speaker'), icon: Radio },
    { value: 'camera', label: t('device.types.camera'), icon: Camera },
    { value: 'gadget', label: t('device.types.gadget'), icon: Gamepad },
    { value: 'light', label: t('device.types.light'), icon: Lightbulb },
    { value: 'toy', label: t('device.types.toy'), icon: ToyBrick },
    { value: 'other', label: t('device.types.other'), icon: HelpCircle },
  ];
  const navigate = useNavigate();
  const { user } = useAuth();
  const { devices } = useDevices();
  const { userPlan, isLimitReached } = useUserPlan();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  // 制限チェック
  const isDeviceLimitReached = isLimitReached.devices(devices.length);

  useEffect(() => {
    // ページ読み込み時に制限チェック
    if (isDeviceLimitReached) {
      setShowLimitWarning(true);
    }
  }, [isDeviceLimitReached]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'remotecontroller' as DeviceType,
    batteryShape: '単3形',
    batteryCount: 1,
    batteryLifeWeeks: '' as string | number,
    purchaseDate: '',
    notes: '',
  });

  // 画像アップロード関連のステート
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [uploadedImageBlob, setUploadedImageBlob] = useState<Blob | null>(null);

  // 画像選択ハンドラ
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      console.error(t('battery.detail.imageSelectError'), err);
      setError(err instanceof Error ? err.message : t('battery.detail.imageSelectFailed'));
    }
  };

  // 画像クロップ完了ハンドラ
  const handleCropComplete = async (croppedBlob: Blob) => {
    setUploadedImageBlob(croppedBlob);
    setShowCropper(false);
    setSelectedImage(URL.createObjectURL(croppedBlob));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // 制限チェック
    if (isDeviceLimitReached) {
      setError(t('device.form.limitReachedError'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // デバイスを作成
      const createdDevice = await createDevice({
        name: formData.name,
        type: formData.type,
        battery_shape: formData.batteryShape,
        battery_count: formData.batteryCount,
        battery_life_weeks: formData.batteryLifeWeeks ? Number(formData.batteryLifeWeeks) : null,
        purchase_date: formData.purchaseDate || null,
        notes: formData.notes || null,
        user_id: user.id,
      });

      // 画像がある場合はアップロード
      if (uploadedImageBlob) {
        try {
          await uploadDeviceImage(
            user.id,
            createdDevice.id,
            uploadedImageBlob
          );
        } catch (imageError) {
          console.error(t('battery.detail.imageUploadError'), imageError);
          // 画像アップロードエラーは致命的ではないので、続行する
        }
      }

      navigate('/devices');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('device.form.createError'));
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => navigate('/devices')}
              className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('device.detail.backToList')}
            </button>
          </div>

          <div className="bg-white dark:bg-dark-card shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">{t('device.form.title')}</h2>
            </div>

            {showLimitWarning && (
              <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      {t('device.form.limitReachedWarning', { current: devices.length, max: userPlan?.max_devices || 5 })}
                      <button
                        className="ml-2 font-medium text-amber-700 underline"
                        onClick={() => alert(t('device.form.upgradeInDevelopment'))}
                      >
                        {t('device.form.upgradePlan')}
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
              {/* 画像アップロード */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('battery.form.imageLabel')}
                </label>

                {selectedImage ? (
                  <div className="relative group">
                    <img
                      src={selectedImage}
                      alt={t('device.detail.imageAlt', { name: formData.name || formData.type })}
                      className="w-32 h-32 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                      <Upload className="h-6 w-6 text-white dark:text-gray-300" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none"
                  >
                    <Upload className="h-6 w-6 text-gray-400 dark:text-gray-500 mb-1" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('battery.form.uploadImage')}
                    </span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('battery.form.imageHelp')}
                </p>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('device.form.nameLabel')}
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('device.detail.deviceType')}
                </label>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {deviceTypeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div
                        key={option.value}
                        className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${formData.type === option.value
                          ? 'border-blue-500 ring-2 ring-blue-500 dark:border-blue-600 dark:ring-blue-600'
                          : 'border-gray-300 dark:border-gray-600'
                          }`}
                        onClick={() => setFormData({ ...formData, type: option.value as DeviceType })}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                              <p className="font-medium text-gray-900 dark:text-dark-text">{option.label}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="batteryShape" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('device.detail.batteryShape')}
                  </label>
                  <select
                    id="batteryShape"
                    value={formData.batteryShape}
                    onChange={(e) => setFormData({ ...formData, batteryShape: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="単1形">{t('battery.shape.d')}</option>
                    <option value="単2形">{t('battery.shape.c')}</option>
                    <option value="単3形">{t('battery.shape.aa')}</option>
                    <option value="単4形">{t('battery.shape.aaa')}</option>
                    <option value="9V形">{t('battery.shape.9v')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="batteryCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('device.form.batteryCountLabel')}
                  </label>
                  <input
                    type="number"
                    id="batteryCount"
                    min="1"
                    required
                    value={formData.batteryCount}
                    onChange={(e) => setFormData({ ...formData, batteryCount: parseInt(e.target.value) })}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="batteryLifeWeeks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('device.detail.batteryLife')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="batteryLifeWeeks"
                    min="1"
                    value={formData.batteryLifeWeeks}
                    onChange={(e) => setFormData({ ...formData, batteryLifeWeeks: e.target.value })}
                    placeholder={t('device.detail.batteryLifePlaceholder')}
                    className="block w-full border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{t('device.detail.weeks')}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('device.form.batteryLifeHelp')}
                </p>
              </div>

              <div>
                <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('device.detail.purchaseDate')}
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('device.detail.notes')}
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300"
                />
              </div>

              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? t('device.form.saving') : t('device.form.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 画像クロッパー */}
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
    </>
  );
}

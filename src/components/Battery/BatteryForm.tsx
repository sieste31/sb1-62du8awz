// 電池作成画面のコンポーネント

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Battery, ArrowLeft, Upload } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { useBatteryGroups, useUserPlan } from '@/lib/hooks';
import { createBatteryGroupWithBatteries, uploadBatteryGroupImage } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { validateImage } from '@/lib/imageUtils';
import { ImageCropper } from '@/components/ImageCropper';
import { BatteryShapeSelect } from './components/BatteryShapeSelect';
import { BatteryKindSelector } from './components/BatteryKindSelector';
import { BatteryShape, BatteryKind, BatteryCreationStatus } from './types';

export function BatteryForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { batteryGroups } = useBatteryGroups();
  const { userPlan, isLimitReached } = useUserPlan();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  // 制限チェック
  const isBatteryGroupLimitReached = isLimitReached.batteryGroups(batteryGroups.length);

  useEffect(() => {
    // ページ読み込み時に制限チェック
    if (isBatteryGroupLimitReached) {
      setShowLimitWarning(true);
    }
  }, [isBatteryGroupLimitReached]);

  const [formData, setFormData] = useState({
    name: '',
    shape: '単3形' as BatteryShape,
    kind: 'disposable' as BatteryKind,
    status: 'charged' as BatteryCreationStatus,
    count: 1,
    voltage: 1.5,
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
    if (isBatteryGroupLimitReached) {
      setError(t('battery.form.limitReachedError'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 電池グループと電池を一括で作成
      const createdGroup = await createBatteryGroupWithBatteries(
        {
          name: formData.name,
          shape: formData.shape,
          kind: formData.kind,
          count: formData.count,
          voltage: formData.voltage,
          notes: formData.notes || null,
          user_id: user.id,
        },
        formData.count,
        formData.status,
        user.id
      );

      // 画像がある場合はアップロード
      if (uploadedImageBlob) {
        try {
          await uploadBatteryGroupImage(
            user.id,
            createdGroup.id,
            uploadedImageBlob
          );
        } catch (imageError) {
          console.error(t('battery.detail.imageUploadError'), imageError);
          // 画像アップロードエラーは致命的ではないので、続行する
        }
      }

      navigate('/batteries');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('battery.form.createError'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/batteries')}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('battery.list.backToList')}
          </button>
        </div>

        <div className="bg-white dark:bg-dark-card shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center">
              <Battery className="h-6 w-6 text-gray-400 dark:text-gray-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">{t('battery.form.title')}</h2>
            </div>
          </div>

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
                    alt={t('battery.detail.imageAlt', { type: formData.shape })}
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
                {t('battery.form.nameLabel')}
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text"
                placeholder={t('battery.form.namePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="shape" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('battery.detail.shape')}
              </label>
              <BatteryShapeSelect
                value={formData.shape}
                onChange={(shape) => setFormData({ ...formData, shape })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('battery.detail.kind')}
              </label>
              <BatteryKindSelector
                value={formData.kind}
                onChange={(kind) => setFormData({
                  ...formData,
                  kind,
                  status: kind === 'disposable' ? 'empty' : formData.status
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('battery.form.statusLabel')}
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div
                  className={`relative flex rounded-lg border p-4 ${formData.status === 'charged'
                    ? 'border-blue-500 dark:border-blue-700 ring-2 ring-blue-500 dark:ring-blue-700 bg-white dark:bg-dark-card'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card'
                    } ${formData.kind === 'disposable'
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                    }`}
                  onClick={() => {
                    if (formData.kind === 'rechargeable') {
                      setFormData({ ...formData, status: 'charged' });
                    }
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 dark:text-dark-text">{t('battery.status.charged')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${formData.status === 'empty'
                    ? 'border-blue-500 dark:border-blue-700 ring-2 ring-blue-500 dark:ring-blue-700 bg-white dark:bg-dark-card'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card'
                    }`}
                  onClick={() => setFormData({ ...formData, status: 'empty' })}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 dark:text-dark-text">{t('battery.status.empty')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="count" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('battery.detail.count')}
              </label>
              <input
                type="number"
                id="count"
                min="1"
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text"
              />
            </div>

            <div>
              <label htmlFor="voltage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('battery.voltage')}
              </label>
              <input
                type="number"
                id="voltage"
                step="0.1"
                min="0"
                value={formData.voltage}
                onChange={(e) => setFormData({ ...formData, voltage: parseFloat(e.target.value) })}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('battery.detail.memo')}
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? t('battery.form.saving') : t('battery.form.submit')}
              </button>
            </div>
          </form>
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
    </div>
  );
}

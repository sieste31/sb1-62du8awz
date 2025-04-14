// 電池詳細画面を表示するコンポーネント

import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBatteryGroup } from '@/lib/hooks';
import { getBatteryImage, defaultBatteryImages } from '@/lib/batteryImages';
import { BatteryDetailItem } from './BatteryDetailItemSection/BatteryDetailItem';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { useTranslation } from 'react-i18next';
import { BatteryDetailInfoSection } from './BatteryDetailInfoSection';
import { BatteryDetailItemSection } from './BatteryDetailItemSection';


export function BatteryDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { batteryGroup: loadBatteryGroup, batteries: loadBatteries, loading } = useBatteryGroup(id || '');

  // Zustandストアから状態と関数を取得
  const {
    isEditing, setIsEditing,
    editData, initializeEditData,
    error, setError,
    imageUrl, setImageUrl,
    showDeleteConfirm, setShowDeleteConfirm,
    saving, deleting,
    handleSave, handleDelete, handleCancelEdit,
    batteryGroup, setBatteryGroup, batteries, setBatteries,
  } = useBatteryDetailStore();

  // 1. 基本データの同期
  useEffect(() => {
    if (loadBatteryGroup && !loading) {
      setBatteryGroup(loadBatteryGroup);
      setBatteries(loadBatteries);
    }
  }, [loadBatteryGroup, loadBatteries, loading, setBatteryGroup, setBatteries]);

  // 2. 編集状態の初期化
  useEffect(() => {
    if (batteryGroup && !loading) {
      initializeEditData(batteryGroup);
      setIsEditing(false); // 編集モードをリセット
    }
  }, [batteryGroup, loading, initializeEditData, setIsEditing]);

  // 3. 画像URLの取得
  useEffect(() => {
    if (batteryGroup && !loading) {
      getBatteryImage(
        (batteryGroup.shape || batteryGroup.type) as keyof typeof defaultBatteryImages,
        batteryGroup.image_url
      ).then(url => setImageUrl(url));
    }
  }, [batteryGroup, loading, setImageUrl]);

  // supabaseから取得されるまでの間、loadingを表示
  if (loading || !loadBatteryGroup || !loadBatteries || !batteryGroup || !batteries || !editData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 戻るボタン */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/batteries')}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('battery.list.backToList')}
          </button>
        </div>
        {/* 電池詳細画面 情報部分 */}
        <BatteryDetailInfoSection />

        {/* 電池詳細画面 電池一覧部分 */}
        <BatteryDetailItemSection />

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <DeleteConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title={t('battery.list.deleteGroup')}
          message={t('battery.list.deleteConfirmation', { name: batteryGroup.name })}
          loading={deleting}
        />

      </div>
    </div>
  );
}

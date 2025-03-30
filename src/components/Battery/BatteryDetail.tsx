// 電池詳細画面を表示するコンポーネント

import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBatteryGroup } from '@/lib/hooks';
import { getBatteryImage, defaultBatteryImages } from '@/lib/batteryImages';
import { BatteryDetailItem } from './BatteryDetailItem';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { BatteryDetailImage } from './BatteryDetailImage';
import { BatteryDetailElemShape } from './BatteryDetailElemShape';
import { BatteryDetailElemKind } from './BatteryDetailElemKind';
import { BatteryDetailElemCount } from './BatteryDetailElemCount';
import { BatteryDetailElemVolt } from './BatteryDetailElemVolt';
import { BatteryDetailElemMemo } from './BatteryDetailElemMemo';
import { BatteryDetailElemHead } from './BatteryDetailElemHead';


export function BatteryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { batteryGroup, batteries, loading } = useBatteryGroup(id || '');

  // Zustandストアから状態と関数を取得
  const {
    isEditing, setIsEditing,
    editData, initializeEditData,
    error, setError,
    imageUrl, setImageUrl,
    showDeleteConfirm, setShowDeleteConfirm,
    saving, deleting,
    handleSave, handleDelete, handleCancelEdit,
    setBatteryGroup, setBatteries,
    restrictTypeAndCountEditing
  } = useBatteryDetailStore();

  // 初期データをセット
  useEffect(() => {
    if (batteryGroup) {
      setBatteryGroup(batteryGroup);
      setBatteries(batteries);
      initializeEditData(batteryGroup);
      setIsEditing(false); // 編集モードをリセット

      // 画像URLを取得
      getBatteryImage((batteryGroup.shape || batteryGroup.type) as keyof typeof defaultBatteryImages, batteryGroup.image_url)
        .then(url => setImageUrl(url));
    }
  }, [id, batteryGroup, batteries, setBatteryGroup, setBatteries, initializeEditData, setImageUrl, setIsEditing]);

  if (loading || !batteryGroup || !editData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }



  // 電池をslot_numberで昇順にソート
  const sortedBatteries = batteries ? [...batteries].sort((a, b) => a.slot_number - b.slot_number) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/batteries')}
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <BatteryDetailElemHead />

          <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
            <div className="flex space-x-6">
              <BatteryDetailImage
                imageUrl={imageUrl}
                batteryGroup={batteryGroup}
                setError={setError}
              />
              <div className="flex-1">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <BatteryDetailElemShape />
                  <BatteryDetailElemKind />
                  <BatteryDetailElemCount />
                  <BatteryDetailElemVolt />
                  <BatteryDetailElemMemo />
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">個別設定</h3>
          </div>
          <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedBatteries.map((battery) => (
                <BatteryDetailItem
                  key={battery.slot_number}
                  battery={battery}
                  batteryGroup={batteryGroup}
                  setError={setError}
                />
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <DeleteConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="電池グループの削除"
          message={`「${batteryGroup.name}」を削除してもよろしいですか？\n\n※この操作は取り消せません。`}
          loading={deleting}
        />

      </div>
    </div>
  );
}

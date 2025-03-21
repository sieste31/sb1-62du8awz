import React, { useState, useRef, useEffect } from 'react';
import { Battery, Camera, Upload, Pencil, X, Check, ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-provider';
import { useBatteryGroup } from '@/lib/hooks';
import { getBatteryImage, defaultBatteryImages } from '@/lib/batteryImages';
import { compressImage } from '@/lib/imageUtils';
import { BatteryDetailItem } from './BatteryDetailItem';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { ImageCropper } from '@/components/ImageCropper';
import type { Database } from '@/lib/database.types';
import {BatteryDetailImage} from './BatteryDetailImage';
import { BatteryDetailElemTitle } from './BatteryDetailElemTitle';
import {BatteryDetailElemType} from './BatteryDetailElemType';
import {BatteryDetailElemKind} from './BatteryDetailElemKind';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'];
type Battery = Database['public']['Tables']['batteries']['Row'] & {
  devices?: Database['public']['Tables']['devices']['Row'] | null;
};

interface BatteryDetailProps {
  id: string;
}

export function BatteryDetail({ id }: BatteryDetailProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { batteryGroup, batteries, loading } = useBatteryGroup(id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    name: string;
    type: string;
    kind: 'disposable' | 'rechargeable';
    count: number;
    voltage: number;
    notes: string;
  } | null>(null);

  // 初期データをセット
  useEffect(() => {
    if (batteryGroup) {
      setEditData({
        name: batteryGroup.name,
        type: batteryGroup.type,
        kind: batteryGroup.kind,
        count: batteryGroup.count,
        voltage: batteryGroup.voltage,
        notes: batteryGroup.notes ?? '',
      });

      // 画像URLを取得
      getBatteryImage(batteryGroup.type as keyof typeof defaultBatteryImages, batteryGroup.image_url)
        .then(url => setImageUrl(url));
    }
  }, [batteryGroup, isEditing]);

  if (loading || !batteryGroup || !editData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }


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

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);

    try {
      const currentCount = batteryGroup.count;
      const newCount = editData.count;

      // デバイスに設定されている電池の数を確認
      const installedCount: number = batteries.filter((b: Battery) => b.device_id).length;

      // 本数を減らす場合は、デバイスに設定されている電池がないことを確認
      if (newCount < currentCount && installedCount > 0) {
        throw new Error('デバイスに設定されている電池があるため、本数を減らすことはできません');
      }

      // 電池グループを更新
      const { error: groupError } = await supabase
        .from('battery_groups')
        .update({
          name: editData.name,
          type: editData.type,
          kind: editData.kind,
          count: editData.count,
          voltage: editData.voltage,
          notes: editData.notes || null,
        })
        .eq('id', batteryGroup.id);

      if (groupError) throw groupError;

      // 本数が増えた場合は新しい電池を追加
      if (newCount > currentCount) {
        const newBatteries = Array.from(
          { length: newCount - currentCount },
          () => ({
            group_id: batteryGroup.id,
            status: batteryGroup.kind === 'rechargeable' ? 'charged' : 'empty',
            user_id: user.id,
          })
        );

        const { error: insertError } = await supabase
          .from('batteries')
          .insert(newBatteries);

        if (insertError) throw insertError;
      }
      // 本数が減った場合は余分な電池を削除（デバイスに設定されていない電池のみ）
      else if (newCount < currentCount) {
        const batteriesToKeep = batteries
          .sort((a: Battery, b: Battery) => {
            // デバイスに設定されている電池を優先
            if (a.device_id && !b.device_id) return -1;
            if (!a.device_id && b.device_id) return 1;
            // 次にスロット番号の小さい順
            return a.slot_number - b.slot_number;
          })
          .slice(0, newCount);

        const batteriesToDelete = batteries
          .filter((b: Battery) => !batteriesToKeep.find((keep: { id: string; }) => keep.id === b.id))
          .map((b: Battery) => b.id);

        if (batteriesToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from('batteries')
            .delete()
            .in('id', batteriesToDelete);

          if (deleteError) throw deleteError;
        }
      }

      setIsEditing(false);
      setSaving(false);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setDeleting(true);
    setError(null);

    try {
      // 電池グループを削除すると、関連する電池も自動的に削除される（ON DELETE CASCADE）
      const { error: deleteError } = await supabase
        .from('battery_groups')
        .delete()
        .eq('id', batteryGroup.id);

      if (deleteError) throw deleteError;

      // 画像も削除
      if (batteryGroup.image_url) {
        const filePath = batteryGroup.image_url.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('battery-images')
            .remove([`${user.id}/${batteryGroup.id}/${filePath}`]);
        }
      }

      router.push('/batteries');
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to current battery group data
    setEditData({
      name: batteryGroup.name,
      type: batteryGroup.type,
      kind: batteryGroup.kind,
      count: batteryGroup.count,
      voltage: batteryGroup.voltage,
      notes: batteryGroup.notes ?? '',
    });
    setIsEditing(false);
  };


  // 電池をslot_numberで昇順にソート
  const sortedBatteries = [...batteries].sort((a, b) => a.slot_number - b.slot_number);

  // デバイスに設定されている電池の数を計算
  const installedCount = batteries.filter((b: Battery) => b.device_id).length;
  
  // 使用中の電池があるかどうかを確認
  const hasInUseBatteries = batteries.some((b: Battery) => b.status === 'in_use' || b.device_id);
  
  // 電池種別と本数の編集を制限するかどうか
  const restrictTypeAndCountEditing = hasInUseBatteries;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/batteries')}
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
                <Battery className="h-6 w-6 text-gray-400 mr-3" />  
                <BatteryDetailElemTitle isEditing={isEditing} name={editData.name} setName={(e) => setEditData({ ...editData, name: e.name })} />
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  登録日: {new Date(batteryGroup.created_at).toLocaleDateString()}
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={installedCount > 0}
                      title={installedCount > 0 ? 'デバイスに設定されている電池があるため削除できません' : '電池グループを削除'}
                      className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:hover:text-gray-400"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
            <div className="flex space-x-6">
              <BatteryDetailImage
                imageUrl={imageUrl}
                batteryGroup={batteryGroup}
                setError={setError}
                setSelectedImage={setSelectedImage}
                setShowCropper={setShowCropper}
              />
              <div className="flex-1">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <BatteryDetailElemType
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={(data: { type: string }) => {setEditData({ ...editData, ...data })}}
                    restrictTypeAndCountEditing={restrictTypeAndCountEditing}
                    batteryGroup={batteryGroup}
                  />

                  <BatteryDetailElemKind
                    isEditing={isEditing}
                    editData={editData}
                    setEditData={(data) => setEditData({ ...editData, ...data })}
                    restrictTypeAndCountEditing={restrictTypeAndCountEditing}
                    batteryGroup={batteryGroup}
                  />

                  <div>
                    <dt className="text-sm font-medium text-gray-500">本数</dt>
                    <dd className="mt-1">
                      {isEditing ? (
                        <div>
                          <input
                            type="number"
                            min="1"
                            value={editData.count}
                            onChange={(e) => setEditData({ ...editData, count: parseInt(e.target.value) })}
                            disabled={restrictTypeAndCountEditing}
                            className={`block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              restrictTypeAndCountEditing
                                ? 'bg-gray-100 cursor-not-allowed border-gray-300'
                                : editData.count < batteryGroup.count && installedCount > 0
                                ? 'border-red-300'
                                : 'border-gray-300'
                            }`}
                          />
                          {restrictTypeAndCountEditing ? (
                            <p className="mt-1 text-xs text-amber-600">
                              使用中の電池があるため変更できません
                            </p>
                          ) : editData.count < batteryGroup.count && installedCount > 0 && (
                            <p className="mt-1 text-sm text-red-600">
                              デバイスに設定されている電池があるため、本数を減らすことはできません
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-900">{batteryGroup.count}本</span>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">電圧</dt>
                    <dd className="mt-1">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={editData.voltage}
                          onChange={(e) => setEditData({ ...editData, voltage: parseFloat(e.target.value) })}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{batteryGroup.voltage}V</span>
                      )}
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">メモ</dt>
                    <dd className="mt-1">
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={editData.notes}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{batteryGroup.notes || '---'}</span>
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
            <h3 className="text-lg font-medium text-gray-900">個別設定</h3>
          </div>
          <div className="divide-y divide-gray-200">
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
    </div>
  );
}

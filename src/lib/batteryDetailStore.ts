// 電池詳細画面の状態管理

'use client';

import { create } from 'zustand';
import { supabase } from './supabase';
import { useRouter } from 'next/navigation';
import type { Database } from './database.types';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'];
type Battery = Database['public']['Tables']['batteries']['Row'] & {
  devices?: Database['public']['Tables']['devices']['Row'] | null;
};

interface EditData {
  name: string;
  type: string;
  kind: 'disposable' | 'rechargeable';
  count: number;
  voltage: number;
  notes: string;
}

interface BatteryDetailState {
  // 状態
  batteryGroup: BatteryGroup | null;
  batteries: Battery[];
  isEditing: boolean;
  editData: EditData | null;
  imageUrl: string | null;
  error: string | null;
  saving: boolean;
  deleting: boolean;
  showDeleteConfirm: boolean;

  // 計算された値
  installedCount: number;
  restrictTypeAndCountEditing: boolean;

  // アクション
  setIsEditing: (isEditing: boolean) => void;
  setEditData: (data: Partial<EditData>) => void;
  setError: (error: string | null) => void;
  setImageUrl: (url: string | null) => void;
  setSaving: (saving: boolean) => void;
  setDeleting: (deleting: boolean) => void;
  setShowDeleteConfirm: (show: boolean) => void;
  setBatteryGroup: (batteryGroup: BatteryGroup | null) => void;
  setBatteries: (batteries: Battery[]) => void;

  // 初期化
  initializeEditData: (batteryGroup: BatteryGroup) => void;
  resetEditData: () => void;

  // 操作
  handleSave: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleCancelEdit: () => void;
}

export const useBatteryDetailStore = create<BatteryDetailState>((set, get) => ({
  // 初期状態
  batteryGroup: null,
  batteries: [],
  isEditing: false,
  editData: null,
  imageUrl: null,
  error: null,
  saving: false,
  deleting: false,
  showDeleteConfirm: false,

  // 計算された値
  get installedCount() {
    return get().batteries.filter(b => b.device_id !== null && b.device_id !== undefined).length;
  },
  restrictTypeAndCountEditing: false,

  // アクション
  setIsEditing: (isEditing) => set({ isEditing }),
  setEditData: (data) => set(state => ({
    editData: state.editData ? { ...state.editData, ...data } : null
  })),
  setError: (error) => set({ error }),
  setImageUrl: (imageUrl) => set({ imageUrl }),
  setSaving: (saving) => set({ saving }),
  setDeleting: (deleting) => set({ deleting }),
  setShowDeleteConfirm: (showDeleteConfirm) => set({ showDeleteConfirm }),
  setBatteryGroup: (batteryGroup) => set({ batteryGroup }),
  setBatteries: (batteries) => {
    console.log("setBatteries");
    const installedCount = batteries.filter(b => b.device_id !== null && b.device_id !== undefined).length;
    console.log(installedCount);
    set({ batteries,  restrictTypeAndCountEditing: installedCount > 0 })
  },

  // 初期化
  initializeEditData: (batteryGroup) => set({
    editData: {
      name: batteryGroup.name,
      type: batteryGroup.type,
      kind: batteryGroup.kind,
      count: batteryGroup.count,
      voltage: batteryGroup.voltage,
      notes: batteryGroup.notes ?? '',
    }
  }),

  resetEditData: () => {
    const { batteryGroup } = get();
    if (batteryGroup) {
      set({
        editData: {
          name: batteryGroup.name,
          type: batteryGroup.type,
          kind: batteryGroup.kind,
          count: batteryGroup.count,
          voltage: batteryGroup.voltage,
          notes: batteryGroup.notes ?? '',
        },
        isEditing: false
      });
    }
  },

  // 操作
  handleSave: async () => {
    const { batteryGroup, editData, batteries } = get();
    if (!batteryGroup || !editData) return;

    set({ saving: true, error: null });

    try {
      // ユーザー情報を取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('ユーザー情報が取得できませんでした');

      const currentCount = batteryGroup.count;
      const newCount = editData.count;

      // デバイスに設定されている電池の数を確認
      const installedCount = batteries.filter(b => b.device_id !== null && b.device_id !== undefined).length;

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
          .sort((a, b) => {
            // デバイスに設定されている電池を優先
            if ((a.device_id !== null && a.device_id !== undefined) && (b.device_id === null || b.device_id === undefined)) return -1;
            if ((a.device_id === null || a.device_id === undefined) && (b.device_id !== null && b.device_id !== undefined)) return 1;
            // 次にスロット番号の小さい順
            return a.slot_number - b.slot_number;
          })
          .slice(0, newCount);

        const batteriesToDelete = batteries
          .filter(b => !batteriesToKeep.find(keep => keep.id === b.id))
          .map(b => b.id);

        if (batteriesToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from('batteries')
            .delete()
            .in('id', batteriesToDelete);

          if (deleteError) throw deleteError;
        }
      }

      set({ isEditing: false, saving: false });
      window.location.reload();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '保存に失敗しました',
        saving: false
      });
    }
  },

  handleDelete: async () => {
    const { batteryGroup } = get();
    if (!batteryGroup) return;

    set({ deleting: true, error: null });

    try {
      // ユーザー情報を取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('ユーザー情報が取得できませんでした');

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

      // 一覧ページに戻る
      window.location.href = '/batteries';
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '削除に失敗しました',
        deleting: false,
        showDeleteConfirm: false
      });
    }
  },

  handleCancelEdit: () => {
    get().resetEditData();
  }
}));

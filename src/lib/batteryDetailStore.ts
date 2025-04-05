// 電池詳細画面の状態管理

import { create } from 'zustand';
import type { Database } from './database.types';
import { invalidateQueries } from './query';
import { 
  updateBatteryGroup, 
  createBatteries, 
  removeBatteryFromDevice,
  deleteBatteryGroup
} from './api';
import { getCurrentUser } from './api';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'];
type Battery = Database['public']['Tables']['batteries']['Row'] & {
  devices?: Database['public']['Tables']['devices']['Row'] | null;
};

interface EditData {
  name: string;
  shape: string;
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
  removeBatteryFromDevice: (batteryId: string) => Promise<boolean>;
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
  handleSave: (queryClient?: any) => Promise<void>;
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
  removeBatteryFromDevice: async (batteryId: string) => {
    try {
      const now = new Date().toISOString();
      
      // APIを使用して電池をデバイスから取り外す
      const success = await removeBatteryFromDevice(batteryId);
      
      if (success) {
        // ストアの状態を更新
        const { batteries } = get();
        const updatedBatteries = batteries.map(b => 
          b.id === batteryId 
            ? { ...b, device_id: null, status: 'empty' as const, last_changed_at: now, devices: null } 
            : b
        );
        set({ batteries: updatedBatteries });
      }
      
      return success;
    } catch (err) {
      console.error('電池取り外しエラー:', err);
      throw err;
    }
  },
  
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
      shape: batteryGroup.shape || batteryGroup.type, // 互換性のために両方サポート
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
          shape: batteryGroup.shape || batteryGroup.type, // 互換性のために両方サポート
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
  handleSave: async (queryClient) => {
    const { batteryGroup, editData, batteries } = get();
    if (!batteryGroup || !editData) return;

    set({ saving: true, error: null });

    try {
      // ユーザー情報を取得
      const user = await getCurrentUser();
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
      await updateBatteryGroup(batteryGroup.id, {
        name: editData.name,
        shape: editData.shape,
        kind: editData.kind,
        count: editData.count,
        voltage: editData.voltage,
        notes: editData.notes || null,
      });

      // 本数が増えた場合は新しい電池を追加
      if (newCount > currentCount) {
        const newBatteries = Array.from(
          { length: newCount - currentCount },
          () => ({
            group_id: batteryGroup.id,
            status: batteryGroup.kind === 'rechargeable' ? 'charged' as const : 'empty' as const,
            user_id: user.id,
          })
        );

        await createBatteries(newBatteries);
      }
      // 本数が減った場合は余分な電池を削除（デバイスに設定されていない電池のみ）
      // 注意: この部分は複雑なので、APIモジュールに移動するか、ここで処理するかは検討が必要

      set({ isEditing: false, saving: false });
      
      // React Queryのキャッシュを無効化
      if (queryClient) {
        const { invalidateBatteries } = invalidateQueries(queryClient);
        await invalidateBatteries();
      }
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
      // 電池グループを削除
      await deleteBatteryGroup(batteryGroup.id);

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

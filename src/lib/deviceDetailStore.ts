// デバイス詳細画面の状態管理

import { create } from 'zustand';
import type { Database } from './database.types';
import { validateImage } from './imageUtils';
import { invalidateQueries } from './query';
import { useQueryClient } from '@tanstack/react-query';
import { updateDevice } from './api/devices';
import { uploadDeviceImage } from './api/storage';
import { getCurrentUser } from './api/auth';

type Device = Database['public']['Tables']['devices']['Row'];

interface EditData {
  name: string;
  type: Device['type'];
  batteryShape: string;
  batteryCount: number;
  batteryLifeWeeks: string | number;
  purchaseDate: string;
  notes: string;
}

interface DeviceDetailState {
  // 状態
  id: string | null; // 現在表示中のデバイスID
  isEditing: boolean;
  editData: EditData | null;
  imageUrl: string | null;
  selectedImage: string | null;
  showCropper: boolean;
  error: string | null;
  saving: boolean;
  showHistory: boolean;

  // アクション
  setId: (id: string | null) => void;
  setIsEditing: (isEditing: boolean) => void;
  setEditData: (data: Partial<EditData>) => void;
  setError: (error: string | null) => void;
  setImageUrl: (url: string | null) => void;
  setSelectedImage: (image: string | null) => void;
  setShowCropper: (show: boolean) => void;
  setSaving: (saving: boolean) => void;
  setShowHistory: (show: boolean) => void;

  // 初期化
  initializeEditData: (device: Device) => void;
  resetEditData: (device: Device) => void;

  // 操作
  handleSave: (queryClient?: any) => Promise<void>;
  handleCancelEdit: (device: Device) => void;
  handleImageSelect: (file: File, userId: string) => Promise<void>;
  handleCropComplete: (croppedBlob: Blob, deviceId: string) => Promise<void>;
  calculateBatteryEndDate: (device: Device) => Date | null;
}

export const useDeviceDetailStore = create<DeviceDetailState>((set, get) => ({
  // 初期状態
  id: null,
  isEditing: false,
  editData: null,
  imageUrl: null,
  selectedImage: null,
  showCropper: false,
  error: null,
  saving: false,
  showHistory: false,

  // アクション
  setId: (id) => set({ id }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setEditData: (data) => set(state => ({
    editData: state.editData ? { ...state.editData, ...data } : null
  })),
  setError: (error) => set({ error }),
  setImageUrl: (imageUrl) => set({ imageUrl }),
  setSelectedImage: (selectedImage) => set({ selectedImage }),
  setShowCropper: (showCropper) => set({ showCropper }),
  setSaving: (saving) => set({ saving }),
  setShowHistory: (showHistory) => set({ showHistory }),

  // 初期化
  initializeEditData: (device) => set({
    editData: {
      name: device.name,
      type: device.type,
      batteryShape: device.battery_shape,
      batteryCount: device.battery_count,
      batteryLifeWeeks: device.battery_life_weeks || '',
      purchaseDate: device.purchase_date || '',
      notes: device.notes || '',
    }
  }),

  resetEditData: (device) => {
    set({
      editData: {
        name: device.name,
        type: device.type,
        batteryShape: device.battery_shape,
        batteryCount: device.battery_count,
        batteryLifeWeeks: device.battery_life_weeks || '',
        purchaseDate: device.purchase_date || '',
        notes: device.notes || '',
      },
      isEditing: false
    });
  },

  // 操作
  handleSave: async (queryClient) => {
    const { id, editData } = get();
    if (!id || !editData) return;

    set({ saving: true, error: null });

    try {
      await updateDevice(id, {
        name: editData.name,
        type: editData.type,
        battery_shape: editData.batteryShape,
        battery_count: editData.batteryCount,
        battery_life_weeks: editData.batteryLifeWeeks ? Number(editData.batteryLifeWeeks) : null,
        purchase_date: editData.purchaseDate || null,
        notes: editData.notes || null,
      });

      // React Queryのキャッシュを無効化
      if (queryClient) {
        const { invalidateDevices } = invalidateQueries(queryClient);
        await invalidateDevices();
      }

      set({ isEditing: false, saving: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '保存に失敗しました',
        saving: false
      });
    }
  },

  handleCancelEdit: (device) => {
    get().resetEditData(device);
  },

  handleImageSelect: async (file: File, userId: string) => {
    try {
      validateImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        set({
          selectedImage: reader.result as string,
          showCropper: true
        });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('画像選択エラー:', err);
      set({
        error: err instanceof Error ? err.message : '画像の選択に失敗しました'
      });
    }
  },

  handleCropComplete: async (croppedBlob: Blob, deviceId: string) => {
    if (!deviceId) return;

    try {
      // ユーザー情報を取得
      const user = await getCurrentUser();
      if (!user) throw new Error('ユーザー情報が取得できませんでした');

      // 画像をアップロード
      await uploadDeviceImage(
        user.id,
        deviceId,
        croppedBlob,
        null // 既存の画像URLはAPIで取得するため不要
      );

      set({
        showCropper: false,
        selectedImage: null
      });
      
      window.location.reload();
    } catch (err) {
      console.error('画像アップロード処理エラー:', err);
      set({
        error: err instanceof Error ? err.message : '画像のアップロードに失敗しました'
      });
    }
  },

  calculateBatteryEndDate: (device) => {
    if (!device || !device.last_battery_change || !device.battery_life_weeks) return null;
    
    const lastChange = new Date(device.last_battery_change);
    const endDate = new Date(lastChange);
    endDate.setDate(endDate.getDate() + (device.battery_life_weeks * 7));
    return endDate;
  }
}));

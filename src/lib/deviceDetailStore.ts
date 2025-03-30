// デバイス詳細画面の状態管理

import { create } from 'zustand';
import { supabase } from './supabase';
import type { Database } from './database.types';
import { compressImage, validateImage } from './imageUtils';
import { invalidateQueries } from './hooks';
import { useQueryClient } from '@tanstack/react-query';

type Device = Database['public']['Tables']['devices']['Row'];
type Battery = Database['public']['Tables']['batteries']['Row'] & {
  battery_groups?: Database['public']['Tables']['battery_groups']['Row'];
};

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
  device: Device | null;
  batteries: Battery[];
  isEditing: boolean;
  editData: EditData | null;
  imageUrl: string | null;
  selectedImage: string | null;
  showCropper: boolean;
  error: string | null;
  saving: boolean;
  showHistory: boolean;


  // アクション
  setIsEditing: (isEditing: boolean) => void;
  setEditData: (data: Partial<EditData>) => void;
  setError: (error: string | null) => void;
  setImageUrl: (url: string | null) => void;
  setSelectedImage: (image: string | null) => void;
  setShowCropper: (show: boolean) => void;
  setSaving: (saving: boolean) => void;
  setShowHistory: (show: boolean) => void;
  setDevice: (device: Device | null) => void;
  setBatteries: (batteries: Battery[]) => void;

  // 初期化
  initializeEditData: (device: Device) => void;
  resetEditData: () => void;

  // 操作
  handleSave: (queryClient?: any) => Promise<void>;
  handleCancelEdit: () => void;
  handleImageSelect: (file: File, userId: string) => Promise<void>;
  handleCropComplete: (croppedBlob: Blob) => Promise<void>;
  calculateBatteryEndDate: () => Date | null;
}

export const useDeviceDetailStore = create<DeviceDetailState>((set, get) => ({
  // 初期状態
  device: null,
  batteries: [],
  isEditing: false,
  editData: null,
  imageUrl: null,
  selectedImage: null,
  showCropper: false,
  error: null,
  saving: false,
  showHistory: false,


  // アクション
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
  setDevice: (device) => set({ device }),
  setBatteries: (batteries) => set({ batteries }),

  // 初期化
  initializeEditData: (device) => set({
    editData: {
      name: device.name,
      type: device.type,
      batteryShape: device.battery_type,
      batteryCount: device.battery_count,
      batteryLifeWeeks: device.battery_life_weeks || '',
      purchaseDate: device.purchase_date || '',
      notes: device.notes || '',
    }
  }),

  resetEditData: () => {
    const { device } = get();
    if (device) {
      set({
        editData: {
          name: device.name,
          type: device.type,
          batteryShape: device.battery_type,
          batteryCount: device.battery_count,
          batteryLifeWeeks: device.battery_life_weeks || '',
          purchaseDate: device.purchase_date || '',
          notes: device.notes || '',
        },
        isEditing: false
      });
    }
  },

  // 操作
  handleSave: async (queryClient) => {
    const { device, editData } = get();
    if (!device || !editData) return;

    set({ saving: true, error: null });

    try {
      const { error: updateError } = await supabase
        .from('devices')
        .update({
          name: editData.name,
          type: editData.type,
          battery_type: editData.batteryShape,
          battery_count: editData.batteryCount,
          battery_life_weeks: editData.batteryLifeWeeks ? Number(editData.batteryLifeWeeks) : null,
          purchase_date: editData.purchaseDate || null,
          notes: editData.notes || null,
        })
        .eq('id', device.id);

      if (updateError) throw updateError;

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

  handleCancelEdit: () => {
    get().resetEditData();
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

  handleCropComplete: async (croppedBlob: Blob) => {
    const { device } = get();
    if (!device) return;

    try {
      // ユーザー情報を取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('ユーザー情報が取得できませんでした');

      const compressedFile = await compressImage(croppedBlob, {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 200,
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

  calculateBatteryEndDate: () => {
    const { device } = get();
    if (!device || !device.last_battery_change || !device.battery_life_weeks) return null;
    
    const lastChange = new Date(device.last_battery_change);
    const endDate = new Date(lastChange);
    endDate.setDate(endDate.getDate() + (device.battery_life_weeks * 7));
    return endDate;
  }
}));

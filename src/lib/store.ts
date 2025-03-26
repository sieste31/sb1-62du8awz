import { create } from 'zustand';
import type { Database } from './database.types';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
  batteries?: (Database['public']['Tables']['batteries']['Row'] & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
  })[];
};

type Device = Database['public']['Tables']['devices']['Row'];

interface ImageCache {
  [key: string]: string;
}

interface AppState {
  batteryGroups: BatteryGroup[];
  devices: Device[];
  imageCache: ImageCache;
  setBatteryGroups: (batteryGroups: BatteryGroup[]) => void;
  setDevices: (devices: Device[]) => void;
  updateBatteryGroup: (id: string, updates: Partial<BatteryGroup>) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  addBatteryGroup: (batteryGroup: BatteryGroup) => void;
  addDevice: (device: Device) => void;
  setCachedImage: (key: string, url: string) => void;
  getCachedImage: (key: string) => string | null;
}

export const useStore = create<AppState>((set, get) => ({
  batteryGroups: [],
  devices: [],
  imageCache: {},
  setBatteryGroups: (batteryGroups) => set({ batteryGroups }),
  setDevices: (devices) => set({ devices }),
  updateBatteryGroup: (id, updates) =>
    set((state) => ({
      batteryGroups: state.batteryGroups.map((group) =>
        group.id === id ? { ...group, ...updates } : group
      ),
    })),
  updateDevice: (id, updates) =>
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === id ? { ...device, ...updates } : device
      ),
    })),
  addBatteryGroup: (batteryGroup) =>
    set((state) => ({
      batteryGroups: [batteryGroup, ...state.batteryGroups],
    })),
  addDevice: (device) =>
    set((state) => ({
      devices: [device, ...state.devices],
    })),
  setCachedImage: (key, url) =>
    set((state) => ({
      imageCache: { ...state.imageCache, [key]: url }
    })),
  getCachedImage: (key) => get().imageCache[key] || null,
}));

import { create } from 'zustand';
import { useEffect } from 'react';
import type { Database } from './database.types';
import { 
  useBatteryGroupsQuery, 
  useBatteryGroupQuery, 
  useBatteriesQuery,
  useDevicesQuery,
  useDeviceQuery,
  useDeviceBatteriesQuery,
  useUserPlanQuery,
  useAvailableBatteriesQuery
} from './query';
import { isLimitReached } from './api/userPlans';

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

/**
 * 電池グループ一覧を取得し、ストアに保存するフック
 */
export function useBatteryGroupsStore() {
  const { data, isLoading } = useBatteryGroupsQuery();
  const setBatteryGroups = useStore((state) => state.setBatteryGroups);
  
  useEffect(() => {
    if (data) {
      setBatteryGroups(data);
    }
  }, [data, setBatteryGroups]);

  return { 
    batteryGroups: useStore((state) => state.batteryGroups), 
    loading: isLoading 
  };
}

/**
 * 特定の電池グループとその電池を取得し、ストアに保存するフック
 */
export function useBatteryGroupStore(id: string) {
  const { data: batteryGroup, isLoading: loadingGroup } = useBatteryGroupQuery(id);
  const { data: batteries, isLoading: loadingBatteries } = useBatteriesQuery(id);
  const updateBatteryGroup = useStore((state) => state.updateBatteryGroup);

  useEffect(() => {
    if (batteryGroup) {
      updateBatteryGroup(id, batteryGroup);
    }
  }, [batteryGroup, id, updateBatteryGroup]);

  return {
    batteryGroup: batteryGroup ?? null,
    batteries: batteries ?? [],
    loading: loadingGroup || loadingBatteries,
  };
}

/**
 * デバイス一覧を取得し、ストアに保存するフック
 */
export function useDevicesStore() {
  const { data, isLoading } = useDevicesQuery();
  const setDevices = useStore((state) => state.setDevices);
  
  useEffect(() => {
    if (data) {
      setDevices(data);
    }
  }, [data, setDevices]);

  return { 
    devices: useStore((state) => state.devices), 
    loading: isLoading 
  };
}

/**
 * 特定のデバイスとその電池を取得し、ストアに保存するフック
 */
export function useDeviceStore(id: string) {
  const { data: device, isLoading: loadingDevice } = useDeviceQuery(id);
  const { data: batteries, isLoading: loadingBatteries } = useDeviceBatteriesQuery(id);
  const updateDevice = useStore((state) => state.updateDevice);

  useEffect(() => {
    if (device) {
      updateDevice(id, device);
    }
  }, [device, id, updateDevice]);

  return {
    device: device ?? null,
    batteries: batteries ?? [],
    loading: loadingDevice || loadingBatteries,
  };
}

/**
 * ユーザープラン情報を取得するフック
 */
export function useUserPlanStore() {
  const { data, isLoading } = useUserPlanQuery();
  
  return {
    userPlan: data,
    loading: isLoading,
    isLimitReached: {
      batteryGroups: (currentCount: number) => 
        data ? isLimitReached(data, 'batteryGroups', currentCount) : false,
      devices: (currentCount: number) => 
        data ? isLimitReached(data, 'devices', currentCount) : false,
    }
  };
}

/**
 * 利用可能な電池を取得するフック
 */
export function useAvailableBatteriesStore(batteryType: string) {
  const { data, isLoading } = useAvailableBatteriesQuery(batteryType);
  
  return { 
    availableBatteryGroups: data ?? [], 
    loading: isLoading 
  };
}

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
import { isDemoUser, isDemoData, canEditData } from './demo';
import { useAuth } from './auth-provider';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
  batteries?: (Database['public']['Tables']['batteries']['Row'] & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
  })[];
};

type Device = Database['public']['Tables']['devices']['Row'];

interface AppState {
  batteryGroups: BatteryGroup[];
  devices: Device[];
  setBatteryGroups: (batteryGroups: BatteryGroup[]) => void;
  setDevices: (devices: Device[]) => void;
  updateBatteryGroup: (id: string, updates: Partial<BatteryGroup>) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  addBatteryGroup: (batteryGroup: BatteryGroup) => void;
  addDevice: (device: Device) => void;
}

export const useStore = create<AppState>((set) => ({
  batteryGroups: [],
  devices: [],
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
}));

/**
 * 電池グループ一覧を取得するフック
 */
export function useBatteryGroupsStore() {
  const { user } = useAuth();
  const { data, isLoading } = useBatteryGroupsQuery();
  const setBatteryGroups = useStore((state) => state.setBatteryGroups);

  useEffect(() => {
    if (data) {
      setBatteryGroups(data);
    }
  }, [data, setBatteryGroups]);

  return {
    batteryGroups: useStore((state) => state.batteryGroups),
    loading: isLoading,
    canEdit: canEditData(user, data?.[0]?.user_id)
  };
}

/**
 * 特定の電池グループを取得するフック
 */
export function useBatteryGroupStore(id: string) {
  const { user } = useAuth();
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
    canEdit: canEditData(user, batteryGroup?.user_id)
  };
}

/**
 * デバイス一覧を取得するフック
 */
export function useDevicesStore() {
  const { user } = useAuth();
  const { data, isLoading } = useDevicesQuery();
  const setDevices = useStore((state) => state.setDevices);

  useEffect(() => {
    if (data) {
      setDevices(data);
    }
  }, [data, setDevices]);

  return {
    devices: useStore((state) => state.devices),
    loading: isLoading,
    canEdit: canEditData(user, data?.[0]?.user_id)
  };
}

/**
 * 特定のデバイスを取得するフック
 */
export function useDeviceStore(id: string) {
  const { user } = useAuth();
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
    canEdit: canEditData(user, device?.user_id)
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
        data ? isLimitReached(currentCount, data, 'batteryGroups') : false,
      devices: (currentCount: number) =>
        data ? isLimitReached(currentCount, data, 'devices') : false,
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

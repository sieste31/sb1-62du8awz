import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useStore } from './store';
import { useAuth } from './auth-provider';
import type { Database } from './database.types';
import { getUserPlan, isLimitReached } from './api/userPlans';
import { getDevices, getDevice, getDeviceBatteries } from './api/devices';
import { getBatteryGroups, getBatteryGroup, getBatteries, getAvailableBatteries } from './api/batteries';

type UserPlan = Database['public']['Tables']['user_plans']['Row'];

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
  batteries?: (Database['public']['Tables']['batteries']['Row'] & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
  })[];
};

type Battery = Database['public']['Tables']['batteries']['Row'] & {
  devices?: Database['public']['Tables']['devices']['Row'] | null;
  battery_groups?: Database['public']['Tables']['battery_groups']['Row'];
};

type Device = Database['public']['Tables']['devices']['Row'];

export const QUERY_KEYS = {
  BATTERY_GROUPS: 'batteryGroups',
  BATTERY_GROUP: 'batteryGroup',
  DEVICES: 'devices',
  DEVICE: 'device',
  AVAILABLE_BATTERIES: 'availableBatteries',
  DEVICE_BATTERIES: 'deviceBatteries',
  USER_PLAN: 'userPlan',
} as const;

/**
 * ユーザープラン情報を取得するフック
 * ユーザーの現在のプラン情報と制限を取得します
 */
export function useUserPlan() {
  const { user } = useAuth();
  
  const { data, isLoading: loading } = useQuery({
    queryKey: [QUERY_KEYS.USER_PLAN, user?.id],
    queryFn: async () => {
      if (!user) return null;
      return await getUserPlan(user.id);
    },
    enabled: !!user,
    staleTime: 60 * 1000, // 1分間キャッシュ
  });
  
  return {
    userPlan: data,
    loading,
    isLimitReached: {
      batteryGroups: (currentCount: number) => 
        data ? isLimitReached(data, 'batteryGroups', currentCount) : false,
      devices: (currentCount: number) => 
        data ? isLimitReached(data, 'devices', currentCount) : false,
    }
  };
}

export function useBatteryGroups() {
  const queryClient = useQueryClient();
  const setBatteryGroups = useStore((state) => state.setBatteryGroups);
  const batteryGroups = useStore((state) => state.batteryGroups);

  const { data, isLoading: loading } = useQuery({
    queryKey: [QUERY_KEYS.BATTERY_GROUPS],
    queryFn: async () => {
      return await getBatteryGroups();
    },
    staleTime: 0,
  });

  if (loading){
    return { batteryGroups: [], loading };
  }

  // データが取得できたら、ストアに保存
  setBatteryGroups(data || []);

  return { batteryGroups: data || [], loading };
}

export function useBatteryGroup(id: string) {
  const queryClient = useQueryClient();
  const updateBatteryGroup = useStore((state) => state.updateBatteryGroup);

  const { data: batteryGroup, isLoading: loadingGroup } = useQuery({
    queryKey: [QUERY_KEYS.BATTERY_GROUP, id],
    queryFn: async () => {
      return await getBatteryGroup(id);
    },
    staleTime: 0,
  });

  const { data: batteries, isLoading: loadingBatteries } = useQuery({
    queryKey: ['batteries', id],
    queryFn: async () => {
      return await getBatteries(id);
    },
    staleTime: 0,
    enabled: !!batteryGroup,
  });

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

export function useDevices() {
  const queryClient = useQueryClient();
  const setDevices = useStore((state) => state.setDevices);
  const devices = useStore((state) => state.devices);

  const { data, isLoading: loading } = useQuery({
    queryKey: [QUERY_KEYS.DEVICES],
    queryFn: async () => {
      return await getDevices();
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (data) {
      setDevices(data);
    }
  }, [data, setDevices]);

  return { devices: data || [], loading };
}

export function useDevice(id: string) {
  const queryClient = useQueryClient();
  const updateDevice = useStore((state) => state.updateDevice);

  const { data, isLoading: loading } = useQuery({
    queryKey: [QUERY_KEYS.DEVICE, id],
    queryFn: async () => {
      const device = await getDevice(id);
      const batteries = await getDeviceBatteries(id);
      
      return {
        device,
        batteries,
      };
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (data?.device) {
      updateDevice(id, data.device);
    }
  }, [data, id, updateDevice]);

  return {
    device: data?.device ?? null,
    batteries: data?.batteries ?? [],
    loading,
  };
}

export function useDeviceBatteries(deviceId: string) {
  const { data, isLoading: loading } = useQuery({
    queryKey: [QUERY_KEYS.DEVICE_BATTERIES, deviceId],
    queryFn: async () => {
      return await getDeviceBatteries(deviceId);
    },
    staleTime: 0,
  });

  return {
    batteries: data || [],
    installedCount: data?.length || 0,
    loading,
  };
}

export function useAvailableBatteries(batteryType: string) {
  const queryClient = useQueryClient();

  const { data, isLoading: loading } = useQuery({
    queryKey: [QUERY_KEYS.AVAILABLE_BATTERIES, batteryType],
    queryFn: async () => {
      return await getAvailableBatteries(batteryType);
    },
    staleTime: 0,
    enabled: !!batteryType,
  });

  return { availableBatteryGroups: data ?? [], loading };
}

export function invalidateQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return {
    invalidateBatteries: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BATTERY_GROUPS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BATTERY_GROUP] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVAILABLE_BATTERIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICE_BATTERIES] });
    },
    invalidateDevices: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICE_BATTERIES] });
    },
    invalidateUserPlan: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_PLAN] });
    },
  };
}

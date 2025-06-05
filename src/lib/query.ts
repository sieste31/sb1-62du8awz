import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './auth-provider';
import type { Database } from './database.types';
import { getUserPlan } from './api/userPlans';
import { getDevices, getDevice, getDeviceBatteries } from './api/devices';
import { getBatteryGroups, getBatteryGroup, getBatteries, getAvailableBatteries } from './api/batteries';
import { DEMO_USER_ID } from './demo';

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
 * ユーザープラン情報を取得するクエリフック
 */
export function useUserPlanQuery() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEYS.USER_PLAN, user?.id],
    queryFn: async () => {
      if (!user) return null;
      return await getUserPlan(user.id);
    },
    enabled: !!user,
    staleTime: 60 * 1000, // 1分間キャッシュ
  });
}

/**
 * 電池グループ一覧を取得するクエリフック
 */
export function useBatteryGroupsQuery() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEYS.BATTERY_GROUPS, user?.id],
    queryFn: async () => {
      // デモユーザーの場合は特定のユーザーのデータを取得
      if (user?.id === DEMO_USER_ID) {
        return await getBatteryGroups(DEMO_USER_ID);
      }
      return await getBatteryGroups();
    },
    staleTime: 0,
    enabled: !!user,
  });
}

/**
 * 特定の電池グループを取得するクエリフック
 */
export function useBatteryGroupQuery(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEYS.BATTERY_GROUP, id, user?.id],
    queryFn: async () => {
      // デモユーザーの場合は特定のユーザーのデータを取得
      if (user?.id === DEMO_USER_ID) {
        return await getBatteryGroup(id, DEMO_USER_ID);
      }
      return await getBatteryGroup(id);
    },
    staleTime: 0,
    enabled: !!user && !!id,
  });
}

/**
 * 特定の電池グループに属する電池を取得するクエリフック
 */
export function useBatteriesQuery(batteryGroupId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['batteries', batteryGroupId, user?.id],
    queryFn: async () => {
      // デモユーザーの場合は特定のユーザーのデータを取得
      if (user?.id === DEMO_USER_ID) {
        return await getBatteries(batteryGroupId, DEMO_USER_ID);
      }
      return await getBatteries(batteryGroupId);
    },
    staleTime: 0,
    enabled: !!user && !!batteryGroupId,
  });
}

/**
 * デバイス一覧を取得するクエリフック
 */
export function useDevicesQuery() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEYS.DEVICES, user?.id],
    queryFn: async () => {
      // デモユーザーの場合は特定のユーザーのデータを取得
      if (user?.id === DEMO_USER_ID) {
        return await getDevices(DEMO_USER_ID);
      }
      return await getDevices();
    },
    staleTime: 0,
    enabled: !!user,
  });
}

/**
 * 特定のデバイスを取得するクエリフック
 */
export function useDeviceQuery(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEYS.DEVICE, id, user?.id],
    queryFn: async () => {
      // デモユーザーの場合は特定のユーザーのデータを取得
      if (user?.id === DEMO_USER_ID) {
        return await getDevice(id, DEMO_USER_ID);
      }
      return await getDevice(id);
    },
    staleTime: 0,
    enabled: !!user && !!id,
  });
}

/**
 * デバイスに装着されている電池を取得するクエリフック
 */
export function useDeviceBatteriesQuery(deviceId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEYS.DEVICE_BATTERIES, deviceId, user?.id],
    queryFn: async () => {
      // デモユーザーの場合は特定のユーザーのデータを取得
      if (user?.id === DEMO_USER_ID) {
        return await getDeviceBatteries(deviceId, DEMO_USER_ID);
      }
      return await getDeviceBatteries(deviceId);
    },
    staleTime: 0,
    enabled: !!user && !!deviceId,
  });
}

/**
 * 利用可能な電池を取得するクエリフック
 */
export function useAvailableBatteriesQuery(batteryType: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEYS.AVAILABLE_BATTERIES, batteryType, user?.id],
    queryFn: async () => {
      // デモユーザーの場合は特定のユーザーのデータを取得
      if (user?.id === DEMO_USER_ID) {
        return await getAvailableBatteries(batteryType, DEMO_USER_ID);
      }
      return await getAvailableBatteries(batteryType);
    },
    staleTime: 0,
    enabled: !!user && !!batteryType,
  });
}

/**
 * クエリキャッシュを無効化するユーティリティ関数
 */
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

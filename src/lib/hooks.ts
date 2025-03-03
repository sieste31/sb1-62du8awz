'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import { useStore } from './store';
import type { Database } from './database.types';

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

// キャッシュのキー定数
export const QUERY_KEYS = {
  BATTERY_GROUPS: 'batteryGroups',
  BATTERY_GROUP: 'batteryGroup',
  DEVICES: 'devices',
  DEVICE: 'device',
  AVAILABLE_BATTERIES: 'availableBatteries',
} as const;

// 電池グループ一覧の取得
export function useBatteryGroups() {
  const queryClient = useQueryClient();
  const setBatteryGroups = useStore((state) => state.setBatteryGroups);
  const batteryGroups = useStore((state) => state.batteryGroups);

  const { data, isLoading: loading } = useQuery({
    queryKey: [QUERY_KEYS.BATTERY_GROUPS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('battery_groups')
        .select(`
          *,
          batteries (
            *,
            devices (
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BatteryGroup[];
    },
    staleTime: 0, // キャッシュを即時無効化
  });

  useEffect(() => {
    if (data) {
      setBatteryGroups(data);
    }
  }, [data, setBatteryGroups]);

  return { batteryGroups: data || [], loading };
}

// 電池グループ詳細の取得
export function useBatteryGroup(id: string) {
  const queryClient = useQueryClient();
  const updateBatteryGroup = useStore((state) => state.updateBatteryGroup);

  const { data, isLoading: loading } = useQuery({
    queryKey: [QUERY_KEYS.BATTERY_GROUP, id],
    queryFn: async () => {
      const { data: groupData, error: groupError } = await supabase
        .from('battery_groups')
        .select(`
          *,
          batteries (
            *,
            devices (
              *
            )
          )
        `)
        .eq('id', id)
        .single();

      if (groupError) throw groupError;

      const batteries = groupData.batteries || [];
      const batteryGroup = { ...groupData };
      delete batteryGroup.batteries;

      return { batteryGroup, batteries };
    },
    staleTime: 0, // キャッシュを即時無効化
  });

  useEffect(() => {
    if (data?.batteryGroup) {
      updateBatteryGroup(id, data.batteryGroup);
    }
  }, [data, id, updateBatteryGroup]);

  return {
    batteryGroup: data?.batteryGroup ?? null,
    batteries: data?.batteries ?? [],
    loading,
  };
}

// デバイス一覧の取得
export function useDevices() {
  const queryClient = useQueryClient();
  const setDevices = useStore((state) => state.setDevices);
  const devices = useStore((state) => state.devices);

  const { data, isLoading: loading } = useQuery({
    queryKey: [QUERY_KEYS.DEVICES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Device[];
    },
    staleTime: 0, // キャッシュを即時無効化
  });

  useEffect(() => {
    if (data) {
      setDevices(data);
    }
  }, [data, setDevices]);

  return { devices: data || [], loading };
}

// デバイス詳細の取得
export function useDevice(id: string) {
  const queryClient = useQueryClient();
  const updateDevice = useStore((state) => state.updateDevice);

  const { data, isLoading: loading } = useQuery({
    queryKey: [QUERY_KEYS.DEVICE, id],
    queryFn: async () => {
      const { data: deviceData, error: deviceError } = await supabase
        .from('devices')
        .select('*')
        .eq('id', id)
        .single();

      if (deviceError) throw deviceError;

      const { data: batteriesData, error: batteriesError } = await supabase
        .from('batteries')
        .select(`
          *,
          battery_groups (*)
        `)
        .eq('device_id', id)
        .order('slot_number', { ascending: true });

      if (batteriesError) throw batteriesError;

      return {
        device: deviceData as Device,
        batteries: batteriesData as Battery[],
      };
    },
    staleTime: 0, // キャッシュを即時無効化
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

// 利用可能な電池の取得
export function useAvailableBatteries(batteryType: string) {
  const queryClient = useQueryClient();

  const { data, isLoading: loading } = useQuery({
    queryKey: [QUERY_KEYS.AVAILABLE_BATTERIES, batteryType],
    queryFn: async () => {
      const { data: groups, error: groupsError } = await supabase
        .from('battery_groups')
        .select(`
          *,
          batteries (
            *,
            devices (
              id,
              name
            )
          )
        `)
        .eq('type', batteryType)
        .order('created_at', { ascending: false });

      if (groupsError) throw groupsError;

      // すべての電池グループを返す（フィルタリングを削除）
      return groups as BatteryGroup[];
    },
    staleTime: 0, // キャッシュを即時無効化
    enabled: !!batteryType, // batteryTypeが存在する場合のみクエリを実行
  });

  return { availableBatteryGroups: data ?? [], loading };
}

// キャッシュを無効化する関数
export function invalidateQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return {
    // 電池関連のキャッシュを無効化
    invalidateBatteries: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BATTERY_GROUPS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BATTERY_GROUP] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVAILABLE_BATTERIES] });
    },
    // デバイス関連のキャッシュを無効化
    invalidateDevices: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICE] });
    },
  };
}
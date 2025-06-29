import { useMemo } from 'react';
import { useBatteryGroupsQuery, useBatteryGroupQuery } from '../query';
import { BatteryDataAdapter } from './battery-data-adapter';
import type { BatteryInfo } from '../../components/domain/battery/types';
import type { BatteryGroup } from '../../components/Battery/types';

/**
 * 新型コンポーネント用のバッテリーグループデータフック
 * 既存のuseBatteryGroupsQueryの結果を新型コンポーネント用のBatteryInfo配列に変換して提供
 */
export function useBatteryGroupsForNewComponents() {
  const { data: batteryGroups = [], isLoading, error, refetch, isRefetching } = useBatteryGroupsQuery();
  
  return useMemo(() => ({
    data: BatteryDataAdapter.toNewComponentDataBatch(batteryGroups),
    isLoading,
    error,
    refetch,
    isRefetching,
    // 元のBatteryGroupへの逆引きマップ
    getOriginalGroup: (batteryId: string): BatteryGroup | undefined => {
      return BatteryDataAdapter.findOriginalGroup(batteryId, batteryGroups);
    },
    // 元のBatteryオブジェクトを取得
    getOriginalBattery: (batteryId: string) => {
      return BatteryDataAdapter.findOriginalBattery(batteryId, batteryGroups);
    },
    // 生の電池グループデータへのアクセス（移行期間のみ）
    originalGroups: batteryGroups
  }), [batteryGroups, isLoading, error, refetch, isRefetching]);
}

/**
 * 特定のバッテリーグループ用の新型コンポーネントデータフック
 * 単一のバッテリーグループの詳細を新型コンポーネント用に変換
 */
export function useBatteryGroupForNewComponents(groupId: string) {
  const { data: batteryGroup, isLoading, error, refetch, isRefetching } = useBatteryGroupQuery(groupId);
  
  return useMemo(() => ({
    data: batteryGroup ? BatteryDataAdapter.toNewComponentData(batteryGroup) : [],
    isLoading,
    error,
    refetch,
    isRefetching,
    // 元のグループデータ
    originalGroup: batteryGroup,
    // 個別バッテリーの検索
    findBattery: (batteryId: string): BatteryInfo | undefined => {
      if (!batteryGroup) return undefined;
      const batteries = BatteryDataAdapter.toNewComponentData(batteryGroup);
      return batteries.find(b => b.id === batteryId);
    }
  }), [batteryGroup, isLoading, error, refetch, isRefetching, groupId]);
}

/**
 * バッテリー検索フック
 * 新型コンポーネント用のフィルタリング機能付きバッテリー検索
 */
export function useBatterySearchForNewComponents(filters?: {
  shape?: BatteryInfo['shape'];
  status?: BatteryInfo['status'];
  deviceId?: string;
  searchText?: string;
}) {
  const { data: allBatteries, isLoading, error } = useBatteryGroupsForNewComponents();

  return useMemo(() => {
    if (!filters || !allBatteries.length) {
      return {
        data: allBatteries,
        isLoading,
        error,
        count: allBatteries.length
      };
    }

    const filtered = allBatteries.filter(battery => {
      // 形状フィルター
      if (filters.shape && battery.shape !== filters.shape) {
        return false;
      }
      
      // ステータスフィルター
      if (filters.status && battery.status !== filters.status) {
        return false;
      }
      
      // デバイスフィルター
      if (filters.deviceId && battery.deviceId !== filters.deviceId) {
        return false;
      }
      
      // テキスト検索
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        return (
          battery.name.toLowerCase().includes(searchLower) ||
          (battery.deviceName && battery.deviceName.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });

    return {
      data: filtered,
      isLoading,
      error,
      count: filtered.length,
      totalCount: allBatteries.length
    };
  }, [allBatteries, filters, isLoading, error]);
}

/**
 * バッテリー統計フック
 * 新型コンポーネント用のバッテリー統計情報
 */
export function useBatteryStatsForNewComponents() {
  const { data: allBatteries, isLoading, error } = useBatteryGroupsForNewComponents();

  return useMemo(() => {
    if (!allBatteries.length) {
      return {
        total: 0,
        byStatus: {} as Record<BatteryInfo['status'], number>,
        byShape: {} as Record<BatteryInfo['shape'], number>,
        averageVoltage: 0,
        isLoading,
        error
      };
    }

    const byStatus = allBatteries.reduce((acc, battery) => {
      acc[battery.status] = (acc[battery.status] || 0) + 1;
      return acc;
    }, {} as Record<BatteryInfo['status'], number>);

    const byShape = allBatteries.reduce((acc, battery) => {
      acc[battery.shape] = (acc[battery.shape] || 0) + 1;
      return acc;
    }, {} as Record<BatteryInfo['shape'], number>);

    const totalVoltage = allBatteries.reduce((sum, battery) => {
      return sum + (battery.voltage || 0);
    }, 0);

    return {
      total: allBatteries.length,
      byStatus,
      byShape,
      averageVoltage: totalVoltage / allBatteries.length,
      isLoading,
      error
    };
  }, [allBatteries, isLoading, error]);
}

/**
 * 利用可能なバッテリー検索フック（デバイス用）
 * デバイスに利用可能な（未使用の）バッテリーを新型コンポーネント用に提供
 */
export function useAvailableBatteriesForNewComponents(deviceId?: string, requiredShape?: BatteryInfo['shape']) {
  const { data: allBatteries, isLoading, error } = useBatteryGroupsForNewComponents();

  return useMemo(() => {
    const availableBatteries = allBatteries.filter(battery => {
      // 使用中でない電池のみ
      if (battery.deviceId && battery.deviceId !== deviceId) {
        return false;
      }
      
      // 空でない電池のみ
      if (battery.status === 'empty' || battery.status === 'expired') {
        return false;
      }
      
      // 形状が指定されている場合はマッチするもののみ
      if (requiredShape && battery.shape !== requiredShape) {
        return false;
      }
      
      return true;
    });

    return {
      data: availableBatteries,
      isLoading,
      error,
      count: availableBatteries.length
    };
  }, [allBatteries, deviceId, requiredShape, isLoading, error]);
}
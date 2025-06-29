import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  useBatteryGroupsForNewComponents,
  useBatteryGroupForNewComponents,
  useBatterySearchForNewComponents,
  useBatteryStatsForNewComponents,
  useAvailableBatteriesForNewComponents
} from '../battery-store-adapter';

// Mock the query hooks
vi.mock('@/lib/query', () => ({
  useBatteryGroupsQuery: vi.fn(),
  useBatteryGroupQuery: vi.fn()
}));

// Mock the adapter
vi.mock('../battery-data-adapter', () => ({
  BatteryDataAdapter: {
    toNewComponentDataBatch: vi.fn(),
    toNewComponentData: vi.fn(),
    findOriginalGroup: vi.fn(),
    findOriginalBattery: vi.fn()
  }
}));

import { useBatteryGroupsQuery, useBatteryGroupQuery } from '@/lib/query';
import { BatteryDataAdapter } from '../battery-data-adapter';
import type { BatteryGroup } from '@/components/Battery/types';
import type { BatteryInfo } from '@/components/domain/battery/types';

const mockBatteryGroups: BatteryGroup[] = [
  {
    id: 'group-1',
    name: 'テスト電池',
    shape: '単3形',
    type: 'rechargeable',
    kind: 'rechargeable',
    count: 4,
    voltage: 1.2,
    notes: null,
    image_url: null,
    created_at: '2024-01-01T00:00:00Z',
    user_id: 'user-123',
    batteries: []
  }
];

const mockBatteryInfos: BatteryInfo[] = [
  {
    id: 'bat-1',
    name: 'テスト電池',
    shape: 'aa',
    status: 'active',
    voltage: 1.2,
    capacity: 2000,
    deviceId: 'dev-1',
    deviceName: 'テストデバイス'
  },
  {
    id: 'bat-2',
    name: 'テスト電池',
    shape: 'aa',
    status: 'empty',
    voltage: 1.2,
    capacity: 2000
  },
  {
    id: 'bat-3',
    name: 'CR2032電池',
    shape: 'cr2032',
    status: 'active',
    voltage: 3.0,
    capacity: 225
  }
];

describe('Battery Store Adapter Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useBatteryGroupsForNewComponents', () => {
    it('should return converted battery data', () => {
      const mockRefetch = vi.fn();
      
      (useBatteryGroupsQuery as any).mockReturnValue({
        data: mockBatteryGroups,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
        isRefetching: false
      });

      (BatteryDataAdapter.toNewComponentDataBatch as any).mockReturnValue(mockBatteryInfos);
      (BatteryDataAdapter.findOriginalGroup as any).mockReturnValue(mockBatteryGroups[0]);
      (BatteryDataAdapter.findOriginalBattery as any).mockReturnValue(mockBatteryGroups[0].batteries?.[0]);

      const { result } = renderHook(() => useBatteryGroupsForNewComponents());

      expect(result.current.data).toBe(mockBatteryInfos);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.refetch).toBe(mockRefetch);
      expect(result.current.originalGroups).toBe(mockBatteryGroups);
      expect(typeof result.current.getOriginalGroup).toBe('function');
      expect(typeof result.current.getOriginalBattery).toBe('function');
    });

    it('should handle loading state', () => {
      (useBatteryGroupsQuery as any).mockReturnValue({
        data: [],
        isLoading: true,
        error: null,
        refetch: vi.fn(),
        isRefetching: false
      });

      (BatteryDataAdapter.toNewComponentDataBatch as any).mockReturnValue([]);

      const { result } = renderHook(() => useBatteryGroupsForNewComponents());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toEqual([]);
    });

    it('should handle error state', () => {
      const mockError = new Error('Test error');
      
      (useBatteryGroupsQuery as any).mockReturnValue({
        data: [],
        isLoading: false,
        error: mockError,
        refetch: vi.fn(),
        isRefetching: false
      });

      (BatteryDataAdapter.toNewComponentDataBatch as any).mockReturnValue([]);

      const { result } = renderHook(() => useBatteryGroupsForNewComponents());

      expect(result.current.error).toBe(mockError);
    });
  });

  describe('useBatteryGroupForNewComponents', () => {
    it('should return converted single group data', () => {
      const mockRefetch = vi.fn();
      const groupId = 'group-1';
      
      (useBatteryGroupQuery as any).mockReturnValue({
        data: mockBatteryGroups[0],
        isLoading: false,
        error: null,
        refetch: mockRefetch,
        isRefetching: false
      });

      (BatteryDataAdapter.toNewComponentData as any).mockReturnValue([mockBatteryInfos[0]]);

      const { result } = renderHook(() => useBatteryGroupForNewComponents(groupId));

      expect(result.current.data).toEqual([mockBatteryInfos[0]]);
      expect(result.current.originalGroup).toBe(mockBatteryGroups[0]);
      expect(typeof result.current.findBattery).toBe('function');
    });

    it('should return empty array when no group data', () => {
      (useBatteryGroupQuery as any).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
        isRefetching: false
      });

      const { result } = renderHook(() => useBatteryGroupForNewComponents('group-1'));

      expect(result.current.data).toEqual([]);
      expect(result.current.originalGroup).toBeNull();
    });
  });

  describe('useBatterySearchForNewComponents', () => {
    beforeEach(() => {
      (useBatteryGroupsQuery as any).mockReturnValue({
        data: mockBatteryGroups,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
        isRefetching: false
      });

      (BatteryDataAdapter.toNewComponentDataBatch as any).mockReturnValue(mockBatteryInfos);
    });

    it('should return all batteries when no filters', () => {
      const { result } = renderHook(() => useBatterySearchForNewComponents());

      expect(result.current.data).toBe(mockBatteryInfos);
      expect(result.current.count).toBe(3);
    });

    it('should filter by shape', () => {
      const { result } = renderHook(() => 
        useBatterySearchForNewComponents({ shape: 'cr2032' })
      );

      expect(result.current.data).toEqual([mockBatteryInfos[2]]);
      expect(result.current.count).toBe(1);
      expect(result.current.totalCount).toBe(3);
    });

    it('should filter by status', () => {
      const { result } = renderHook(() => 
        useBatterySearchForNewComponents({ status: 'active' })
      );

      expect(result.current.data).toEqual([mockBatteryInfos[0], mockBatteryInfos[2]]);
      expect(result.current.count).toBe(2);
    });

    it('should filter by deviceId', () => {
      const { result } = renderHook(() => 
        useBatterySearchForNewComponents({ deviceId: 'dev-1' })
      );

      expect(result.current.data).toEqual([mockBatteryInfos[0]]);
      expect(result.current.count).toBe(1);
    });

    it('should filter by search text', () => {
      const { result } = renderHook(() => 
        useBatterySearchForNewComponents({ searchText: 'CR2032' })
      );

      expect(result.current.data).toEqual([mockBatteryInfos[2]]);
      expect(result.current.count).toBe(1);
    });

    it('should apply multiple filters', () => {
      const { result } = renderHook(() => 
        useBatterySearchForNewComponents({
          shape: 'aa',
          status: 'active'
        })
      );

      expect(result.current.data).toEqual([mockBatteryInfos[0]]);
      expect(result.current.count).toBe(1);
    });
  });

  describe('useBatteryStatsForNewComponents', () => {
    beforeEach(() => {
      (useBatteryGroupsQuery as any).mockReturnValue({
        data: mockBatteryGroups,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
        isRefetching: false
      });

      (BatteryDataAdapter.toNewComponentDataBatch as any).mockReturnValue(mockBatteryInfos);
    });

    it('should calculate battery statistics', () => {
      const { result } = renderHook(() => useBatteryStatsForNewComponents());

      expect(result.current.total).toBe(3);
      expect(result.current.byStatus).toEqual({
        active: 2,
        empty: 1
      });
      expect(result.current.byShape).toEqual({
        aa: 2,
        cr2032: 1
      });
      expect(result.current.averageVoltage).toBe((1.2 + 1.2 + 3.0) / 3);
    });

    it('should handle empty battery list', () => {
      (BatteryDataAdapter.toNewComponentDataBatch as any).mockReturnValue([]);

      const { result } = renderHook(() => useBatteryStatsForNewComponents());

      expect(result.current.total).toBe(0);
      expect(result.current.byStatus).toEqual({});
      expect(result.current.byShape).toEqual({});
      expect(result.current.averageVoltage).toBe(0);
    });
  });

  describe('useAvailableBatteriesForNewComponents', () => {
    beforeEach(() => {
      (useBatteryGroupsQuery as any).mockReturnValue({
        data: mockBatteryGroups,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
        isRefetching: false
      });

      (BatteryDataAdapter.toNewComponentDataBatch as any).mockReturnValue(mockBatteryInfos);
    });

    it('should return available batteries', () => {
      const { result } = renderHook(() => useAvailableBatteriesForNewComponents());

      // empty batteries should be filtered out, but bat-1 has deviceId so it's excluded without a matching deviceId
      expect(result.current.data).toEqual([mockBatteryInfos[2]]);
      expect(result.current.count).toBe(1);
    });

    it('should filter by required shape', () => {
      const { result } = renderHook(() => 
        useAvailableBatteriesForNewComponents(undefined, 'aa')
      );

      // bat-1 has deviceId so it's excluded without a matching deviceId, only cr2032 shapes remain but we filter for 'aa'
      expect(result.current.data).toEqual([]);
      expect(result.current.count).toBe(0);
    });

    it('should include batteries from specified device', () => {
      const { result } = renderHook(() => 
        useAvailableBatteriesForNewComponents('dev-1')
      );

      // Should include battery that's assigned to dev-1
      expect(result.current.data).toEqual([mockBatteryInfos[0], mockBatteryInfos[2]]);
      expect(result.current.count).toBe(2);
    });

    it('should exclude batteries from other devices', () => {
      const batteriesWithOtherDevice = [
        ...mockBatteryInfos,
        {
          ...mockBatteryInfos[2],
          id: 'bat-4',
          deviceId: 'other-device'
        }
      ];

      (BatteryDataAdapter.toNewComponentDataBatch as any).mockReturnValue(batteriesWithOtherDevice);

      const { result } = renderHook(() => 
        useAvailableBatteriesForNewComponents('dev-1')
      );

      // Should not include battery from other-device
      expect(result.current.count).toBe(2);
      expect(result.current.data.every(b => b.deviceId !== 'other-device')).toBe(true);
    });
  });
});
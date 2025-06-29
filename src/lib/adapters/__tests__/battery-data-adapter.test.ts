import { describe, it, expect } from 'vitest';
import { BatteryDataAdapter, BatteryAdapterError } from '../battery-data-adapter';
import type { BatteryGroup, Battery } from '@/components/Battery/types';
import type { BatteryInfo } from '@/components/domain/battery/types';

describe('BatteryDataAdapter', () => {
  const mockBatteryGroup: BatteryGroup = {
    id: 'group-1',
    name: 'テスト電池',
    shape: '単3形',
    type: 'disposable',
    kind: 'rechargeable',
    count: 4,
    voltage: 1.2,
    notes: 'テストメモ',
    image_url: null,
    created_at: '2024-01-01T00:00:00Z',
    user_id: 'user-123',
    batteries: [
      {
        id: 'bat-1',
        group_id: 'group-1',
        slot_number: 1,
        status: 'charged',
        last_checked: '2024-06-01T12:00:00Z',
        last_changed_at: '2024-05-01T10:00:00Z',
        device_id: 'dev-1',
        created_at: '2024-01-01T00:00:00Z',
        user_id: 'user-123',
        devices: {
          id: 'dev-1',
          name: 'テストデバイス',
          type: 'flashlight',
          model: 'Test Model',
          manufacturer: 'Test Corp',
          description: null,
          battery_shape: '単3形',
          battery_count: 2,
          notes: null,
          image_url: null,
          created_at: '2024-01-01T00:00:00Z',
          user_id: 'user-123'
        }
      },
      {
        id: 'bat-2',
        group_id: 'group-1',
        slot_number: 2,
        status: 'in_use',
        last_checked: null,
        last_changed_at: null,
        device_id: null,
        created_at: '2024-01-01T00:00:00Z',
        user_id: 'user-123'
      }
    ]
  };

  const mockBatteryInfo: BatteryInfo = {
    id: 'bat-1',
    name: 'テスト電池',
    shape: 'aa',
    status: 'active',
    voltage: 1.2,
    capacity: 2000,
    installDate: new Date('2024-05-01T10:00:00Z'),
    lastChecked: new Date('2024-06-01T12:00:00Z'),
    deviceId: 'dev-1',
    deviceName: 'テストデバイス'
  };

  describe('toNewComponentData', () => {
    it('should convert BatteryGroup to BatteryInfo array', () => {
      const result = BatteryDataAdapter.toNewComponentData(mockBatteryGroup);

      expect(result).toHaveLength(2);
      
      const firstBattery = result[0];
      expect(firstBattery.id).toBe('bat-1');
      expect(firstBattery.name).toBe('テスト電池');
      expect(firstBattery.shape).toBe('aa'); // 単3形 → aa
      expect(firstBattery.status).toBe('active'); // charged → active
      expect(firstBattery.voltage).toBe(1.2);
      expect(firstBattery.capacity).toBe(2000); // 単3形 rechargeable
      expect(firstBattery.installDate).toEqual(new Date('2024-05-01T10:00:00Z'));
      expect(firstBattery.lastChecked).toEqual(new Date('2024-06-01T12:00:00Z'));
      expect(firstBattery.deviceId).toBe('dev-1');
      expect(firstBattery.deviceName).toBe('テストデバイス');

      const secondBattery = result[1];
      expect(secondBattery.id).toBe('bat-2');
      expect(secondBattery.status).toBe('active'); // in_use → active
      expect(secondBattery.installDate).toBeUndefined();
      expect(secondBattery.lastChecked).toBeUndefined();
      expect(secondBattery.deviceId).toBeUndefined();
      expect(secondBattery.deviceName).toBeUndefined();
    });

    it('should handle empty batteries array', () => {
      const groupWithoutBatteries: BatteryGroup = {
        ...mockBatteryGroup,
        batteries: []
      };

      const result = BatteryDataAdapter.toNewComponentData(groupWithoutBatteries);
      expect(result).toHaveLength(0);
    });

    it('should handle undefined batteries', () => {
      const groupWithUndefinedBatteries: BatteryGroup = {
        ...mockBatteryGroup,
        batteries: undefined
      };

      const result = BatteryDataAdapter.toNewComponentData(groupWithUndefinedBatteries);
      expect(result).toHaveLength(0);
    });

    it('should throw error for invalid shape', () => {
      const invalidGroup: BatteryGroup = {
        ...mockBatteryGroup,
        shape: '無効な形状'
      };

      expect(() => {
        BatteryDataAdapter.toNewComponentData(invalidGroup);
      }).toThrow(BatteryAdapterError);
    });
  });

  describe('fromNewComponentData', () => {
    it('should convert BatteryInfo to partial BatteryGroup', () => {
      const result = BatteryDataAdapter.fromNewComponentData(mockBatteryInfo);

      expect(result.name).toBe('テスト電池');
      expect(result.shape).toBe('単3形'); // aa → 単3形
      expect(result.voltage).toBe(1.2);
    });

    it('should use default voltage when not provided', () => {
      const infoWithoutVoltage: BatteryInfo = {
        ...mockBatteryInfo,
        voltage: undefined
      };

      const result = BatteryDataAdapter.fromNewComponentData(infoWithoutVoltage);
      expect(result.voltage).toBe(1.5);
    });

    it('should throw error for invalid shape conversion', () => {
      const invalidInfo: BatteryInfo = {
        ...mockBatteryInfo,
        shape: 'invalid' as any
      };

      expect(() => {
        BatteryDataAdapter.fromNewComponentData(invalidInfo);
      }).toThrow(BatteryAdapterError);
    });
  });

  describe('toBatteryUpdate', () => {
    it('should convert BatteryInfo to Battery update data', () => {
      const result = BatteryDataAdapter.toBatteryUpdate(mockBatteryInfo);

      expect(result.status).toBe('charged'); // active → charged
      expect(result.last_checked).toBe('2024-06-01T12:00:00.000Z');
      expect(result.last_changed_at).toBe('2024-05-01T10:00:00.000Z');
      expect(result.device_id).toBe('dev-1');
    });

    it('should handle undefined dates', () => {
      const infoWithoutDates: BatteryInfo = {
        ...mockBatteryInfo,
        installDate: undefined,
        lastChecked: undefined,
        deviceId: undefined
      };

      const result = BatteryDataAdapter.toBatteryUpdate(infoWithoutDates);
      expect(result.last_checked).toBeUndefined();
      expect(result.last_changed_at).toBeUndefined();
      expect(result.device_id).toBeNull();
    });
  });

  describe('estimateCapacity', () => {
    it('should estimate capacity for different shapes and kinds', () => {
      // 単3形 rechargeable
      const aa_rechargeable = BatteryDataAdapter.toNewComponentData({
        ...mockBatteryGroup,
        shape: '単3形',
        kind: 'rechargeable'
      });
      expect(aa_rechargeable[0]?.capacity).toBe(2000);

      // 単3形 disposable
      const aa_disposable = BatteryDataAdapter.toNewComponentData({
        ...mockBatteryGroup,
        shape: '単3形',
        kind: 'disposable'
      });
      expect(aa_disposable[0]?.capacity).toBe(3000);

      // CR2032
      const cr2032 = BatteryDataAdapter.toNewComponentData({
        ...mockBatteryGroup,
        shape: 'CR2032',
        kind: 'disposable'
      });
      expect(cr2032[0]?.capacity).toBe(225);
    });

    it('should return undefined for unknown shapes', () => {
      const unknownShape = BatteryDataAdapter.toNewComponentData({
        ...mockBatteryGroup,
        shape: 'その他'
      });
      expect(unknownShape[0]?.capacity).toBeUndefined();
    });
  });

  describe('batch operations', () => {
    it('should convert multiple BatteryGroups', () => {
      const groups: BatteryGroup[] = [
        mockBatteryGroup,
        {
          ...mockBatteryGroup,
          id: 'group-2',
          name: '別の電池',
          batteries: [
            {
              id: 'bat-3',
              group_id: 'group-2',
              slot_number: 1,
              status: 'empty',
              last_checked: null,
              last_changed_at: null,
              device_id: null,
              created_at: '2024-01-01T00:00:00Z',
              user_id: 'user-123'
            }
          ]
        }
      ];

      const result = BatteryDataAdapter.toNewComponentDataBatch(groups);
      expect(result).toHaveLength(3); // 2 + 1 batteries
    });
  });

  describe('helper methods', () => {
    it('should find original group by battery ID', () => {
      const groups = [mockBatteryGroup];
      const result = BatteryDataAdapter.findOriginalGroup('bat-1', groups);
      expect(result).toBe(mockBatteryGroup);

      const notFound = BatteryDataAdapter.findOriginalGroup('nonexistent', groups);
      expect(notFound).toBeUndefined();
    });

    it('should find original battery by ID', () => {
      const groups = [mockBatteryGroup];
      const result = BatteryDataAdapter.findOriginalBattery('bat-1', groups);
      expect(result).toBe(mockBatteryGroup.batteries![0]);

      const notFound = BatteryDataAdapter.findOriginalBattery('nonexistent', groups);
      expect(notFound).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should create proper error objects', () => {
      const error = new BatteryAdapterError(
        'Test error',
        'CONVERSION_FAILED',
        { test: 'data' }
      );

      expect(error.name).toBe('BatteryAdapterError');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('CONVERSION_FAILED');
      expect(error.originalData).toEqual({ test: 'data' });
    });
  });
});
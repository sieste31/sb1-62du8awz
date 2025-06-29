import { describe, it, expect } from 'vitest';
import { BatteryUnified } from '../battery-unified';

describe('BatteryUnified Types', () => {
  describe('Status type', () => {
    it('should accept valid status values', () => {
      const validStatuses: BatteryUnified.Status[] = [
        'charged',
        'in_use',
        'empty',
        'disposed'
      ];

      validStatuses.forEach(status => {
        expect(typeof status).toBe('string');
        expect(['charged', 'in_use', 'empty', 'disposed']).toContain(status);
      });
    });
  });

  describe('Shape type', () => {
    it('should accept valid shape values', () => {
      const validShapes: BatteryUnified.Shape[] = [
        '単1形',
        '単2形', 
        '単3形',
        '単4形',
        'CR2032',
        'CR2025',
        '9V形',
        'その他'
      ];

      validShapes.forEach(shape => {
        expect(typeof shape).toBe('string');
        expect(['単1形', '単2形', '単3形', '単4形', 'CR2032', 'CR2025', '9V形', 'その他']).toContain(shape);
      });
    });
  });

  describe('BatteryUnified interface', () => {
    it('should create valid BatteryUnified object with required fields', () => {
      const battery: BatteryUnified.BatteryUnified = {
        id: 'test-id',
        name: 'テスト電池',
        shape: '単3形',
        status: 'charged',
        kind: 'rechargeable',
        count: 4,
        createdAt: new Date(),
        userId: 'user-123'
      };

      expect(battery.id).toBe('test-id');
      expect(battery.name).toBe('テスト電池');
      expect(battery.shape).toBe('単3形');
      expect(battery.status).toBe('charged');
      expect(battery.kind).toBe('rechargeable');
      expect(battery.count).toBe(4);
      expect(battery.createdAt).toBeInstanceOf(Date);
      expect(battery.userId).toBe('user-123');
    });

    it('should create valid BatteryUnified object with all optional fields', () => {
      const battery: BatteryUnified.BatteryUnified = {
        id: 'test-id',
        name: 'フル機能電池',
        shape: 'CR2032',
        status: 'in_use',
        kind: 'disposable',
        count: 2,
        createdAt: new Date(),
        userId: 'user-456',
        // Optional fields
        voltage: 3.0,
        notes: 'テストノート',
        imageUrl: 'https://example.com/image.jpg',
        capacity: 225,
        installDate: new Date('2024-01-01'),
        lastChecked: new Date('2024-06-01'),
        deviceId: 'device-789',
        deviceName: 'テストデバイス'
      };

      expect(battery.voltage).toBe(3.0);
      expect(battery.notes).toBe('テストノート');
      expect(battery.imageUrl).toBe('https://example.com/image.jpg');
      expect(battery.capacity).toBe(225);
      expect(battery.installDate).toBeInstanceOf(Date);
      expect(battery.lastChecked).toBeInstanceOf(Date);
      expect(battery.deviceId).toBe('device-789');
      expect(battery.deviceName).toBe('テストデバイス');
    });

    it('should accept both disposable and rechargeable kinds', () => {
      const disposableBattery: BatteryUnified.BatteryUnified = {
        id: 'disposable-1',
        name: '使い捨て電池',
        shape: '単3形',
        status: 'charged',
        kind: 'disposable',
        count: 4,
        createdAt: new Date(),
        userId: 'user-1'
      };

      const rechargeableBattery: BatteryUnified.BatteryUnified = {
        id: 'rechargeable-1',
        name: '充電池',
        shape: '単3形',
        status: 'charged',
        kind: 'rechargeable',
        count: 4,
        createdAt: new Date(),
        userId: 'user-1'
      };

      expect(disposableBattery.kind).toBe('disposable');
      expect(rechargeableBattery.kind).toBe('rechargeable');
    });
  });

  describe('Type compatibility', () => {
    it('should handle Date objects for date fields', () => {
      const now = new Date();
      const battery: BatteryUnified.BatteryUnified = {
        id: 'date-test',
        name: '日付テスト',
        shape: '単4形',
        status: 'empty',
        kind: 'disposable',
        count: 1,
        createdAt: now,
        userId: 'user-date',
        installDate: now,
        lastChecked: now
      };

      expect(battery.createdAt).toBeInstanceOf(Date);
      expect(battery.installDate).toBeInstanceOf(Date);
      expect(battery.lastChecked).toBeInstanceOf(Date);
      expect(battery.createdAt.getTime()).toBe(now.getTime());
    });

    it('should handle undefined optional fields gracefully', () => {
      const battery: BatteryUnified.BatteryUnified = {
        id: 'minimal-test',
        name: '最小限電池',
        shape: '9V形',
        status: 'disposed',
        kind: 'disposable',
        count: 1,
        createdAt: new Date(),
        userId: 'user-minimal',
        voltage: undefined,
        notes: undefined,
        capacity: undefined,
        installDate: undefined,
        lastChecked: undefined,
        deviceId: undefined,
        deviceName: undefined
      };

      expect(battery.voltage).toBeUndefined();
      expect(battery.notes).toBeUndefined();
      expect(battery.capacity).toBeUndefined();
      expect(battery.installDate).toBeUndefined();
      expect(battery.lastChecked).toBeUndefined();
      expect(battery.deviceId).toBeUndefined();
      expect(battery.deviceName).toBeUndefined();
    });
  });
});
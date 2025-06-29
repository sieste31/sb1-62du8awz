import { describe, it, expect } from 'vitest';
import {
  SHAPE_MAPPING,
  STATUS_MAPPING,
  REVERSE_SHAPE_MAPPING,
  REVERSE_STATUS_MAPPING
} from '../battery-shape-mapper';

describe('BatteryShapeMapper', () => {
  describe('SHAPE_MAPPING', () => {
    it('should correctly map Japanese shapes to international standards', () => {
      expect(SHAPE_MAPPING['単1形']).toBe('d');
      expect(SHAPE_MAPPING['単2形']).toBe('c');
      expect(SHAPE_MAPPING['単3形']).toBe('aa');
      expect(SHAPE_MAPPING['単4形']).toBe('aaa');
      expect(SHAPE_MAPPING['CR2032']).toBe('cr2032');
      expect(SHAPE_MAPPING['CR2025']).toBe('cr2025');
      expect(SHAPE_MAPPING['9V形']).toBe('9v');
      expect(SHAPE_MAPPING['その他']).toBe('button');
    });

    it('should have all expected shape keys', () => {
      const expectedKeys = ['単1形', '単2形', '単3形', '単4形', 'CR2032', 'CR2025', '9V形', 'その他'];
      expectedKeys.forEach(key => {
        expect(SHAPE_MAPPING).toHaveProperty(key);
      });
    });

    it('should have unique international values', () => {
      const values = Object.values(SHAPE_MAPPING);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('STATUS_MAPPING', () => {
    it('should correctly map existing status to new status', () => {
      expect(STATUS_MAPPING['charged']).toBe('active');
      expect(STATUS_MAPPING['in_use']).toBe('active');
      expect(STATUS_MAPPING['empty']).toBe('empty');
      expect(STATUS_MAPPING['disposed']).toBe('expired');
    });

    it('should have all expected status keys', () => {
      const expectedKeys = ['charged', 'in_use', 'empty', 'disposed'];
      expectedKeys.forEach(key => {
        expect(STATUS_MAPPING).toHaveProperty(key);
      });
    });
  });

  describe('REVERSE_SHAPE_MAPPING', () => {
    it('should correctly map international shapes to Japanese', () => {
      expect(REVERSE_SHAPE_MAPPING['d']).toBe('単1形');
      expect(REVERSE_SHAPE_MAPPING['c']).toBe('単2形');
      expect(REVERSE_SHAPE_MAPPING['aa']).toBe('単3形');
      expect(REVERSE_SHAPE_MAPPING['aaa']).toBe('単4形');
      expect(REVERSE_SHAPE_MAPPING['cr2032']).toBe('CR2032');
      expect(REVERSE_SHAPE_MAPPING['cr2025']).toBe('CR2025');
      expect(REVERSE_SHAPE_MAPPING['9v']).toBe('9V形');
      expect(REVERSE_SHAPE_MAPPING['button']).toBe('その他');
    });

    it('should be inverse of SHAPE_MAPPING', () => {
      Object.entries(SHAPE_MAPPING).forEach(([jp, intl]) => {
        expect(REVERSE_SHAPE_MAPPING[intl]).toBe(jp);
      });
    });
  });

  describe('REVERSE_STATUS_MAPPING', () => {
    it('should correctly map new status to existing status', () => {
      expect(REVERSE_STATUS_MAPPING['active']).toBe('charged');
      expect(REVERSE_STATUS_MAPPING['empty']).toBe('empty');
      expect(REVERSE_STATUS_MAPPING['expired']).toBe('disposed');
      expect(REVERSE_STATUS_MAPPING['new']).toBe('charged');
      expect(REVERSE_STATUS_MAPPING['low']).toBe('in_use');
      expect(REVERSE_STATUS_MAPPING['unknown']).toBe('charged');
    });

    it('should handle all possible new status values', () => {
      const expectedKeys = ['active', 'empty', 'expired', 'new', 'low', 'unknown'];
      expectedKeys.forEach(key => {
        expect(REVERSE_STATUS_MAPPING).toHaveProperty(key);
      });
    });

    it('should map to valid existing status values', () => {
      const validExistingStatuses = ['charged', 'in_use', 'empty', 'disposed'];
      Object.values(REVERSE_STATUS_MAPPING).forEach(status => {
        expect(validExistingStatuses).toContain(status);
      });
    });
  });

  describe('Integration tests', () => {
    it('should maintain bidirectional consistency for core mappings', () => {
      // Test that core status mappings are consistent
      const coreStatusPairs = [
        ['charged', 'active'],
        ['empty', 'empty'],
        ['disposed', 'expired']
      ] as const;

      coreStatusPairs.forEach(([existing, newStatus]) => {
        expect(STATUS_MAPPING[existing]).toBe(newStatus);
        expect(REVERSE_STATUS_MAPPING[newStatus]).toBe(existing);
      });
    });

    it('should handle edge cases gracefully', () => {
      // Verify that all shape mappings have valid outputs
      Object.values(SHAPE_MAPPING).forEach(intlShape => {
        expect(typeof intlShape).toBe('string');
        expect(intlShape.length).toBeGreaterThan(0);
      });

      // Verify that all status mappings have valid outputs
      Object.values(STATUS_MAPPING).forEach(newStatus => {
        expect(typeof newStatus).toBe('string');
        expect(newStatus.length).toBeGreaterThan(0);
      });
    });
  });
});
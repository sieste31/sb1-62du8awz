import type { Database } from '../database.types';
import type { BatteryGroup, Battery } from '../../components/Battery/types';
import type { BatteryInfo } from '../../components/domain/battery/types';
import { SHAPE_MAPPING, STATUS_MAPPING, REVERSE_SHAPE_MAPPING, REVERSE_STATUS_MAPPING } from './battery-shape-mapper';

/**
 * バッテリーアダプターエラークラス
 */
export class BatteryAdapterError extends Error {
  constructor(
    message: string,
    public readonly code: 'CONVERSION_FAILED' | 'INVALID_SHAPE' | 'MISSING_DATA',
    public readonly originalData?: any
  ) {
    super(message);
    this.name = 'BatteryAdapterError';
  }
}

/**
 * バッテリーデータ変換アダプター
 * 既存のBatteryGroup型と新型のBatteryInfo型の相互変換を行います
 */
export class BatteryDataAdapter {
  /**
   * BatteryGroup → BatteryInfo変換
   * 既存のBatteryGroupデータを新型コンポーネント用のBatteryInfo配列に変換します
   */
  static toNewComponentData(group: BatteryGroup): BatteryInfo[] {
    try {
      if (!group.batteries || group.batteries.length === 0) {
        return [];
      }

      return group.batteries.map(battery => ({
        id: battery.id,
        name: group.name,
        shape: this.convertShapeToNew(group.shape),
        status: this.convertStatusToNew(battery.status),
        voltage: group.voltage,
        capacity: this.estimateCapacity(group.shape, group.kind),
        installDate: battery.last_changed_at ? new Date(battery.last_changed_at) : undefined,
        lastChecked: battery.last_checked ? new Date(battery.last_checked) : undefined,
        deviceId: battery.device_id || undefined,
        deviceName: battery.devices?.name || undefined
      }));
    } catch (error) {
      throw new BatteryAdapterError(
        `Failed to convert BatteryGroup to BatteryInfo: ${error}`,
        'CONVERSION_FAILED',
        group
      );
    }
  }

  /**
   * BatteryInfo → BatteryGroup変換（更新操作用）
   * 新型コンポーネントからのデータを既存のBatteryGroup形式に変換します
   */
  static fromNewComponentData(info: BatteryInfo): Partial<BatteryGroup> {
    try {
      return {
        name: info.name,
        shape: this.convertShapeToExisting(info.shape),
        voltage: info.voltage || 1.5,
        // notesはBatteryInfoにないので、既存の値を保持する必要がある
      };
    } catch (error) {
      throw new BatteryAdapterError(
        `Failed to convert BatteryInfo to BatteryGroup: ${error}`,
        'CONVERSION_FAILED',
        info
      );
    }
  }

  /**
   * BatteryInfo → Battery Update変換
   * 個別電池の更新用データを作成します
   */
  static toBatteryUpdate(info: BatteryInfo): Partial<Database['public']['Tables']['batteries']['Update']> {
    try {
      return {
        status: this.convertStatusToExisting(info.status),
        last_checked: info.lastChecked?.toISOString(),
        last_changed_at: info.installDate?.toISOString(),
        device_id: info.deviceId || null
      };
    } catch (error) {
      throw new BatteryAdapterError(
        `Failed to convert BatteryInfo to Battery update: ${error}`,
        'CONVERSION_FAILED',
        info
      );
    }
  }

  /**
   * 形状を新型に変換
   */
  private static convertShapeToNew(shape: string): BatteryInfo['shape'] {
    const converted = SHAPE_MAPPING[shape as keyof typeof SHAPE_MAPPING];
    if (!converted) {
      throw new BatteryAdapterError(
        `Unknown battery shape: ${shape}`,
        'INVALID_SHAPE',
        shape
      );
    }
    return converted as BatteryInfo['shape'];
  }

  /**
   * 形状を既存型に変換
   */
  private static convertShapeToExisting(shape: BatteryInfo['shape']): string {
    const converted = REVERSE_SHAPE_MAPPING[shape];
    if (!converted) {
      throw new BatteryAdapterError(
        `Unknown new battery shape: ${shape}`,
        'INVALID_SHAPE',
        shape
      );
    }
    return converted;
  }

  /**
   * ステータスを新型に変換
   */
  static convertStatusToNew(status: Battery['status']): BatteryInfo['status'] {
    const converted = STATUS_MAPPING[status];
    if (!converted) {
      return 'unknown';
    }
    return converted as BatteryInfo['status'];
  }

  /**
   * ステータスを既存型に変換
   */
  private static convertStatusToExisting(status: BatteryInfo['status']): Battery['status'] {
    const converted = REVERSE_STATUS_MAPPING[status];
    if (!converted) {
      return 'charged'; // デフォルト値
    }
    return converted as Battery['status'];
  }

  /**
   * 形状と種類に基づいて容量を推定
   */
  private static estimateCapacity(shape: string, kind: string): number | undefined {
    const capacityMap: Record<string, { disposable: number; rechargeable: number }> = {
      '単1形': { disposable: 20000, rechargeable: 10000 },
      '単2形': { disposable: 8000, rechargeable: 4000 },
      '単3形': { disposable: 3000, rechargeable: 2000 },
      '単4形': { disposable: 1200, rechargeable: 800 },
      'CR2032': { disposable: 225, rechargeable: 225 },
      'CR2025': { disposable: 165, rechargeable: 165 },
      '9V形': { disposable: 550, rechargeable: 250 }
    };

    const capacityInfo = capacityMap[shape];
    if (!capacityInfo) {
      return undefined;
    }

    return kind === 'rechargeable' ? capacityInfo.rechargeable : capacityInfo.disposable;
  }

  /**
   * 複数のBatteryGroupを一括変換
   */
  static toNewComponentDataBatch(groups: BatteryGroup[]): BatteryInfo[] {
    return groups.flatMap(group => this.toNewComponentData(group));
  }

  /**
   * バッテリーIDから元のBatteryGroupを検索するヘルパー
   */
  static findOriginalGroup(batteryId: string, groups: BatteryGroup[]): BatteryGroup | undefined {
    return groups.find(group => 
      group.batteries?.some(battery => battery.id === batteryId)
    );
  }

  /**
   * バッテリーIDから元のBatteryを検索するヘルパー
   */
  static findOriginalBattery(batteryId: string, groups: BatteryGroup[]): Battery | undefined {
    for (const group of groups) {
      if (group.batteries) {
        const battery = group.batteries.find(b => b.id === batteryId);
        if (battery) {
          return battery;
        }
      }
    }
    return undefined;
  }

  /**
   * BatteryInfo用のStatusBadgeプロパティを作成（移行期間用）
   */
  static createStatusBadgeProps(
    info: BatteryInfo, 
    originalBattery?: Battery, 
    useLegacyStyle = false
  ) {
    if (useLegacyStyle && originalBattery) {
      return {
        status: info.status,
        originalStatus: originalBattery.status,
        useTranslation: true
      };
    }
    
    return {
      status: info.status
    };
  }
}
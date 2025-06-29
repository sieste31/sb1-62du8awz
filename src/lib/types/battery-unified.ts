export namespace BatteryUnified {
  // 既存型を基準とした統一型（下位互換性確保）
  export type Status = 'charged' | 'in_use' | 'empty' | 'disposed';
  export type Shape = '単1形' | '単2形' | '単3形' | '単4形' | 'CR2032' | 'CR2025' | '9V形' | 'その他';
  
  // 統一データ構造
  export interface BatteryUnified {
    id: string;
    name: string;
    shape: Shape;
    status: Status;
    voltage?: number;
    kind: 'disposable' | 'rechargeable';
    count: number;
    notes?: string;
    imageUrl?: string;
    createdAt: Date;
    userId: string;
    // 拡張フィールド（新型コンポーネント用）
    capacity?: number;
    installDate?: Date;
    lastChecked?: Date;
    deviceId?: string;
    deviceName?: string;
  }
}
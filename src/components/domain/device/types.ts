/**
 * Device Domain Types
 * デバイスドメインの型定義
 */

import type { ComponentPropsWithoutRef } from 'react';
import type { BatteryShape, BatteryInfo } from '../battery/types';

// デバイスタイプ
export type DeviceType = 'remote' | 'clock' | 'toy' | 'flashlight' | 'smoke_detector' | 'scale' | 'thermometer' | 'other';

// デバイス情報
export interface DeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  batterySlots: BatterySlotInfo[];
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 電池スロット情報
export interface BatterySlotInfo {
  id: string;
  slotNumber: number;
  supportedShapes: BatteryShape[];
  battery?: BatteryInfo;
  required: boolean;
}

// DeviceTypeSelector Props
export interface DeviceTypeSelectorProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value?: DeviceType;
  onChange?: (type: DeviceType) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  layout?: 'grid' | 'list';
}

// DeviceBatterySlot Props
export interface DeviceBatterySlotProps extends ComponentPropsWithoutRef<'div'> {
  slot: BatterySlotInfo;
  onBatteryClick?: (battery: BatteryInfo) => void;
  onSlotClick?: (slot: BatterySlotInfo) => void;
  showShapeInfo?: boolean;
  compact?: boolean;
}

// DeviceListItem Props
export interface DeviceListItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onClick'> {
  device: DeviceInfo;
  onClick?: (device: DeviceInfo) => void;
  onBatteryClick?: (battery: BatteryInfo, device: DeviceInfo) => void;
  showBatteryStatus?: boolean;
  showLocation?: boolean;
  selectable?: boolean;
  selected?: boolean;
}
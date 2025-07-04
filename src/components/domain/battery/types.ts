/**
 * Battery Domain Types
 * 電池ドメインの型定義
 */

import type { ComponentPropsWithoutRef } from 'react';
import type { BadgeProps } from '@/components/primitives';

// 電池ステータス
export type BatteryStatus = 'new' | 'active' | 'low' | 'empty' | 'expired' | 'unknown';

// 電池形状
export type BatteryShape = 'aa' | 'aaa' | 'c' | 'd' | '9v' | 'cr2032' | 'cr2025' | 'button';

// 電池情報
export interface BatteryInfo {
  id: string;
  name: string;
  shape: BatteryShape;
  status: BatteryStatus;
  voltage?: number;
  capacity?: number;
  installDate?: Date;
  lastChecked?: Date;
  deviceId?: string;
  deviceName?: string;
}

// BatteryStatusBadge Props
export interface BatteryStatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  status: BatteryStatus;
  showIcon?: boolean;
  iconOnly?: boolean;
  // 移行期間用のプロパティ
  originalStatus?: 'charged' | 'in_use' | 'empty' | 'disposed';
  useTranslation?: boolean;
}

// BatteryShapeSelector Props
export interface BatteryShapeSelectorProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value?: BatteryShape;
  onChange?: (shape: BatteryShape) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  orientation?: 'horizontal' | 'vertical';
  // 移行期間用のプロパティ
  legacyValue?: '単1形' | '単2形' | '単3形' | '単4形' | 'CR2032' | 'CR2025' | '9V形' | 'その他';
  onLegacyChange?: (shape: '単1形' | '単2形' | '単3形' | '単4形' | 'CR2032' | 'CR2025' | '9V形' | 'その他') => void;
}

// BatteryListItem Props
export interface BatteryListItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onClick'> {
  battery: BatteryInfo;
  onClick?: (battery: BatteryInfo) => void;
  onStatusClick?: (battery: BatteryInfo) => void;
  showDevice?: boolean;
  showDetails?: boolean;
  selectable?: boolean;
  selected?: boolean;
  // 移行期間用のプロパティ
  originalGroup?: any; // BatteryGroup type from existing system
  legacyMode?: boolean;
}
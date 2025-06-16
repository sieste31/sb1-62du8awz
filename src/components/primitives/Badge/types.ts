/**
 * Badge Types
 * Badgeコンポーネントの型定義
 */

import type { BadgeVariant, BadgeSize } from '@/styles/variants';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * バッジのバリアント
   * @default 'primary'
   */
  variant?: BadgeVariant;
  
  /**
   * バッジのサイズ
   * @default 'sm'
   */
  size?: BadgeSize;
  
  /**
   * ドット形式のバッジ
   * @default false
   */
  dot?: boolean;
  
  /**
   * 角の丸み
   * @default 'full'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  
  /**
   * 左側のアイコン
   */
  leftIcon?: React.ReactNode;
  
  /**
   * 右側のアイコン
   */
  rightIcon?: React.ReactNode;
  
  /**
   * 削除可能なバッジ
   * @default false
   */
  removable?: boolean;
  
  /**
   * 削除ボタンがクリックされた時の処理
   */
  onRemove?: () => void;
  
  /**
   * 追加のクラス名
   */
  className?: string;
  
  /**
   * 子要素
   */
  children?: React.ReactNode;
}
/**
 * StatusDisplay Types
 * StatusDisplay関連コンポーネントの型定義
 */

import type { BadgeVariant, CardVariant } from '@/styles/variants';

export type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatusBadgeProps {
  /**
   * ステータスの種類
   */
  status: StatusType;
  
  /**
   * ステータスのラベル
   */
  label: string;
  
  /**
   * ドット形式で表示
   * @default false
   */
  dot?: boolean;
  
  /**
   * アイコン
   */
  icon?: React.ReactNode;
  
  /**
   * サイズ
   * @default 'sm'
   */
  size?: 'xs' | 'sm' | 'md';
  
  /**
   * 追加のクラス名
   */
  className?: string;
}

export interface StatusIndicatorProps {
  /**
   * ステータスの種類
   */
  status: StatusType;
  
  /**
   * インジケーターのサイズ
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * パルスアニメーション
   * @default false
   */
  pulse?: boolean;
  
  /**
   * ステータスのラベル（アクセシビリティ用）
   */
  label?: string;
  
  /**
   * 追加のクラス名
   */
  className?: string;
}

export interface StatusCardProps {
  /**
   * ステータスの種類
   */
  status: StatusType;
  
  /**
   * カードのタイトル
   */
  title: string;
  
  /**
   * カードの説明
   */
  description?: string;
  
  /**
   * アイコン
   */
  icon?: React.ReactNode;
  
  /**
   * アクションボタン
   */
  action?: React.ReactNode;
  
  /**
   * 閉じるボタンを表示
   * @default false
   */
  dismissible?: boolean;
  
  /**
   * 閉じるボタンがクリックされた時の処理
   */
  onDismiss?: () => void;
  
  /**
   * カードのバリアント
   * @default 'default'
   */
  variant?: CardVariant;
  
  /**
   * 追加のクラス名
   */
  className?: string;
  
  /**
   * 子要素
   */
  children?: React.ReactNode;
}

export interface StatusConfig {
  /**
   * 表示名
   */
  label: string;
  
  /**
   * カラー
   */
  color: string;
  
  /**
   * 背景色
   */
  bgColor: string;
  
  /**
   * バッジのバリアント
   */
  badgeVariant: BadgeVariant;
  
  /**
   * デフォルトアイコン
   */
  defaultIcon?: React.ReactNode;
}
/**
 * Button Types
 * Buttonコンポーネントの型定義
 */

import type { ButtonVariant, ButtonSize } from '@/styles/variants';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * ボタンのバリアント
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * ボタンのサイズ
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * ローディング状態
   * @default false
   */
  loading?: boolean;
  
  /**
   * フルwidth
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * アイコンのみのボタン
   * @default false
   */
  iconOnly?: boolean;
  
  /**
   * 左側のアイコン
   */
  leftIcon?: React.ReactNode;
  
  /**
   * 右側のアイコン
   */
  rightIcon?: React.ReactNode;
  
  /**
   * 角の丸み
   * @default 'md'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  
  /**
   * 追加のクラス名
   */
  className?: string;
  
  /**
   * 子要素
   */
  children?: React.ReactNode;
}
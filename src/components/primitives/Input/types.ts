/**
 * Input Types
 * Input関連コンポーネントの型定義
 */

import type { InputVariant, InputSize } from '@/styles/variants';

export interface BaseInputProps {
  /**
   * 入力フィールドのバリアント
   * @default 'default'
   */
  variant?: InputVariant;
  
  /**
   * 入力フィールドのサイズ
   * @default 'md'
   */
  size?: InputSize;
  
  /**
   * フルwidth
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * 角の丸み
   * @default 'md'
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
   * エラーメッセージ
   */
  error?: string;
  
  /**
   * ヘルプテキスト
   */
  helpText?: string;
  
  /**
   * 追加のクラス名
   */
  className?: string;
}

export interface InputProps extends BaseInputProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {}

export interface TextAreaProps extends BaseInputProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * リサイズ可能か
   * @default true
   */
  resize?: boolean;
  
  /**
   * 最小の行数
   * @default 3
   */
  minRows?: number;
  
  /**
   * 最大の行数
   */
  maxRows?: number;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends BaseInputProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * 選択肢
   */
  options: SelectOption[];
  
  /**
   * プレースホルダー
   */
  placeholder?: string;
}
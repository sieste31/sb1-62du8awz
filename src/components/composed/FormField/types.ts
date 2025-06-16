/**
 * FormField Types
 * FormField関連コンポーネントの型定義
 */

import type { InputProps, TextAreaProps, SelectProps } from '@/components/primitives';

export interface BaseFormFieldProps {
  /**
   * フィールドのラベル
   */
  label?: string;
  
  /**
   * 必須フィールドかどうか
   * @default false
   */
  required?: boolean;
  
  /**
   * エラーメッセージ
   */
  error?: string;
  
  /**
   * ヘルプテキスト
   */
  helpText?: string;
  
  /**
   * フィールドの説明
   */
  description?: string;
  
  /**
   * ラベルを隠すかどうか
   * @default false
   */
  hideLabel?: boolean;
  
  /**
   * 追加のクラス名
   */
  className?: string;
  
  /**
   * 子要素
   */
  children?: React.ReactNode;
}

export interface FormFieldProps extends BaseFormFieldProps {
  /**
   * 入力フィールドのタイプ
   * @default 'input'
   */
  as?: 'input' | 'textarea' | 'select';
  
  /**
   * 入力フィールドのプロパティ
   */
  inputProps?: Partial<InputProps>;
  
  /**
   * テキストエリアのプロパティ
   */
  textareaProps?: Partial<TextAreaProps>;
  
  /**
   * セレクトボックスのプロパティ
   */
  selectProps?: Partial<SelectProps>;
}

export interface FormFieldGroupProps extends BaseFormFieldProps {
  /**
   * フィールドの配置方向
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';
  
  /**
   * フィールド間のスペース
   * @default 'md'
   */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * グループ内のフィールド
   */
  children: React.ReactNode;
}

export interface FormFieldErrorProps {
  /**
   * エラーメッセージ
   */
  error?: string;
  
  /**
   * エラーの配列（複数エラー対応）
   */
  errors?: string[];
  
  /**
   * 追加のクラス名
   */
  className?: string;
}
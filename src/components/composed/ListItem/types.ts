/**
 * ListItem Types
 * ListItem関連コンポーネントの型定義
 */

import type { ButtonProps } from '@/components/primitives';

export interface BaseListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * リストアイテムのタイトル
   */
  title?: string;
  
  /**
   * サブタイトル
   */
  subtitle?: string;
  
  /**
   * 説明文
   */
  description?: string;
  
  /**
   * 左側のアイコンまたは画像
   */
  startIcon?: React.ReactNode;
  
  /**
   * 右側のアイコンまたはアクション
   */
  endIcon?: React.ReactNode;
  
  /**
   * アバター表示
   */
  avatar?: React.ReactNode;
  
  /**
   * 無効状態
   * @default false
   */
  disabled?: boolean;
  
  /**
   * クリック可能
   * @default false
   */
  clickable?: boolean;
  
  /**
   * ホバーエフェクト
   * @default false
   */
  hoverable?: boolean;
  
  /**
   * 境界線を表示
   * @default true
   */
  divider?: boolean;
  
  /**
   * パディングサイズ
   * @default 'md'
   */
  padding?: 'sm' | 'md' | 'lg';
  
  /**
   * 追加のクラス名
   */
  className?: string;
  
  /**
   * 子要素
   */
  children?: React.ReactNode;
}

export interface SelectableListItemProps extends BaseListItemProps {
  /**
   * 選択状態
   * @default false
   */
  selected?: boolean;
  
  /**
   * 選択可能
   * @default true
   */
  selectable?: boolean;
  
  /**
   * 複数選択モード（チェックボックス）
   * @default false
   */
  multiSelect?: boolean;
  
  /**
   * 単一選択モード（ラジオボタン）
   * @default false
   */
  singleSelect?: boolean;
  
  /**
   * 選択状態変更のコールバック
   */
  onSelectionChange?: (selected: boolean) => void;
  
  /**
   * チェックボックス/ラジオボタンの名前
   */
  name?: string;
  
  /**
   * チェックボックス/ラジオボタンの値
   */
  value?: string;
}

export interface ExpandableListItemProps extends BaseListItemProps {
  /**
   * 展開状態
   * @default false
   */
  expanded?: boolean;
  
  /**
   * 展開可能
   * @default true
   */
  expandable?: boolean;
  
  /**
   * 展開状態変更のコールバック
   */
  onExpandChange?: (expanded: boolean) => void;
  
  /**
   * 展開時のコンテンツ
   */
  expandedContent?: React.ReactNode;
  
  /**
   * 展開アニメーション
   * @default true
   */
  animated?: boolean;
}

export interface ListItemAction {
  /**
   * アクションのラベル
   */
  label: string;
  
  /**
   * アクションのアイコン
   */
  icon?: React.ReactNode;
  
  /**
   * クリック時の処理
   */
  onClick: () => void;
  
  /**
   * 無効状態
   */
  disabled?: boolean;
  
  /**
   * 危険なアクション（削除など）
   */
  destructive?: boolean;
}
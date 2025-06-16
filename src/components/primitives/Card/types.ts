/**
 * Card Types
 * Card関連コンポーネントの型定義
 */

import type { CardVariant, CardPadding } from '@/styles/variants';

export interface BaseCardProps {
  /**
   * カードのバリアント
   * @default 'default'
   */
  variant?: CardVariant;
  
  /**
   * カードのパディング
   * @default 'md'
   */
  padding?: CardPadding;
  
  /**
   * クリック可能か
   * @default false
   */
  clickable?: boolean;
  
  /**
   * ホバーエフェクト
   * @default false
   */
  hoverable?: boolean;
  
  /**
   * 角の丸み
   * @default 'md'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * 追加のクラス名
   */
  className?: string;
  
  /**
   * 子要素
   */
  children?: React.ReactNode;
}

export interface CardProps extends BaseCardProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * ヘッダーのタイトル
   */
  title?: string;
  
  /**
   * ヘッダーのサブタイトル
   */
  subtitle?: string;
  
  /**
   * 右側のアクション要素
   */
  action?: React.ReactNode;
  
  /**
   * ヘッダーの境界線を表示するか
   * @default true
   */
  divider?: boolean;
  
  /**
   * 追加のクラス名
   */
  className?: string;
  
  /**
   * 子要素
   */
  children?: React.ReactNode;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 追加のクラス名
   */
  className?: string;
  
  /**
   * 子要素
   */
  children?: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * フッターのアクション要素
   */
  actions?: React.ReactNode;
  
  /**
   * フッターの境界線を表示するか
   * @default true
   */
  divider?: boolean;
  
  /**
   * フッターのアクションの配置
   * @default 'end'
   */
  justify?: 'start' | 'center' | 'end' | 'between';
  
  /**
   * 追加のクラス名
   */
  className?: string;
  
  /**
   * 子要素
   */
  children?: React.ReactNode;
}
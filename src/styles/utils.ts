/**
 * Style Utilities
 * スタイル関連のユーティリティ関数
 */

import { tokens } from './tokens';
import type { ColorVariant, ColorTone, SizeVariant } from './tokens';

/**
 * 複数のクラス名を結合する
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * カラートークンを取得する
 */
export function getColorToken(variant: ColorVariant, tone: ColorTone = '500'): string {
  return tokens.colors[variant][tone];
}

/**
 * スペーシングトークンを取得する
 */
export function getSpacingToken(size: SizeVariant): string {
  return tokens.spacing[size];
}

/**
 * 条件付きクラスを適用する
 */
export function conditionalClass(condition: boolean, trueClass: string, falseClass: string = ''): string {
  return condition ? trueClass : falseClass;
}

/**
 * レスポンシブクラスを生成する
 */
export function responsive(base: string, sm?: string, md?: string, lg?: string, xl?: string): string {
  const classes = [base];
  if (sm) classes.push(`sm:${sm}`);
  if (md) classes.push(`md:${md}`);
  if (lg) classes.push(`lg:${lg}`);
  if (xl) classes.push(`xl:${xl}`);
  return classes.join(' ');
}

/**
 * ホバーエフェクトクラスを生成する
 */
export function hoverEffect(base: string, hover: string): string {
  return `${base} hover:${hover} ${tokens.transitions.colors}`;
}

/**
 * フォーカスエフェクトクラスを生成する
 */
export function focusEffect(base: string, variant: ColorVariant = 'primary'): string {
  return `${base} ${tokens.bordersFocus[variant]} outline-none`;
}

/**
 * アクティブエフェクトクラスを生成する
 */
export function activeEffect(base: string, active: string): string {
  return `${base} active:${active} ${tokens.transitions.transform}`;
}

/**
 * 無効状態のクラスを生成する
 */
export function disabledState(base: string): string {
  return `${base} disabled:opacity-50 disabled:cursor-not-allowed`;
}

/**
 * ローディング状態のクラスを生成する
 */
export function loadingState(base: string): string {
  return `${base} opacity-75 cursor-wait pointer-events-none`;
}

/**
 * 切り捨てテキストクラス
 */
export const truncate = {
  single: 'truncate',
  multiLine: (lines: number) => `line-clamp-${lines}`,
};

/**
 * フレックスボックスユーティリティ
 */
export const flex = {
  center: 'flex items-center justify-center',
  centerVertical: 'flex items-center',
  centerHorizontal: 'flex justify-center',
  between: 'flex items-center justify-between',
  start: 'flex items-start',
  end: 'flex items-end',
  wrap: 'flex flex-wrap',
  column: 'flex flex-col',
  columnCenter: 'flex flex-col items-center justify-center',
};

/**
 * 位置決めユーティリティ
 */
export const position = {
  absolute: {
    center: 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    topLeft: 'absolute top-0 left-0',
    topRight: 'absolute top-0 right-0',
    bottomLeft: 'absolute bottom-0 left-0',
    bottomRight: 'absolute bottom-0 right-0',
  },
  fixed: {
    center: 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    topLeft: 'fixed top-0 left-0',
    topRight: 'fixed top-0 right-0',
    bottomLeft: 'fixed bottom-0 left-0',
    bottomRight: 'fixed bottom-0 right-0',
  },
};

/**
 * スクリーンリーダー用のユーティリティ
 */
export const sr = {
  only: 'sr-only',
  focusable: 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0',
};
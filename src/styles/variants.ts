/**
 * Component Variants
 * コンポーネントのバリアントスタイルを定義
 */

import { tokens } from './tokens';

export const buttonVariants = {
  variant: {
    primary: `${tokens.colors.primary[500]} hover:${tokens.colors.primary[600]} focus:${tokens.colors.primary[700]} dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:bg-blue-800 text-white`,
    secondary: `${tokens.colors.secondary[200]} hover:${tokens.colors.secondary[300]} focus:${tokens.colors.secondary[400]} dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:bg-gray-800 text-gray-900 dark:text-white`,
    success: `${tokens.colors.success[500]} hover:${tokens.colors.success[600]} focus:${tokens.colors.success[700]} dark:bg-green-600 dark:hover:bg-green-700 dark:focus:bg-green-800 text-white`,
    warning: `${tokens.colors.warning[500]} hover:${tokens.colors.warning[600]} focus:${tokens.colors.warning[700]} dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:bg-yellow-800 text-white`,
    danger: `${tokens.colors.danger[500]} hover:${tokens.colors.danger[600]} focus:${tokens.colors.danger[700]} dark:bg-red-600 dark:hover:bg-red-700 dark:focus:bg-red-800 text-white`,
    outline: `border-2 border-current bg-transparent hover:bg-current hover:text-white dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:border-gray-600 ${tokens.transitions.colors}`,
    ghost: `bg-transparent hover:${tokens.colors.secondary[100]} dark:hover:bg-gray-700 dark:text-gray-300 ${tokens.transitions.colors}`,
  },
  size: {
    xs: `${tokens.spacingX.sm} ${tokens.spacingY.xs} ${tokens.typography.body.xs}`,
    sm: `${tokens.spacingX.md} ${tokens.spacingY.sm} ${tokens.typography.body.small}`,
    md: `${tokens.spacingX.lg} ${tokens.spacingY.md} ${tokens.typography.body.base}`,
    lg: `${tokens.spacingX.xl} ${tokens.spacingY.lg} ${tokens.typography.body.large}`,
  },
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'opacity-75 cursor-wait',
} as const;

export const inputVariants = {
  variant: {
    default: `${tokens.borders.thin} ${tokens.bordersFocus.primary} ${tokens.colors.secondary[50]} dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500`,
    error: `border-2 border-red-300 ${tokens.bordersFocus.danger} bg-red-50 dark:bg-red-900/20 dark:border-red-500 dark:text-white dark:placeholder-gray-400`,
    success: `border-2 border-green-300 ${tokens.bordersFocus.success} bg-green-50 dark:bg-green-900/20 dark:border-green-500 dark:text-white dark:placeholder-gray-400`,
  },
  size: {
    sm: `${tokens.spacingX.md} ${tokens.spacingY.sm} ${tokens.typography.body.small}`,
    md: `${tokens.spacingX.md} ${tokens.spacingY.md} ${tokens.typography.body.base}`,
    lg: `${tokens.spacingX.lg} ${tokens.spacingY.lg} ${tokens.typography.body.large}`,
  },
  disabled: 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800',
} as const;

export const cardVariants = {
  variant: {
    default: `${tokens.colors.secondary[50]} dark:bg-gray-800 ${tokens.borders.thin} dark:border-gray-700 ${tokens.shadows.sm}`,
    elevated: `${tokens.colors.secondary[50]} dark:bg-gray-800 ${tokens.borders.thin} dark:border-gray-700 ${tokens.shadows.md}`,
    outlined: `${tokens.colors.secondary[50]} dark:bg-gray-800 ${tokens.borders.medium} dark:border-gray-600 ${tokens.shadows.none}`,
    ghost: `bg-transparent ${tokens.borders.none} ${tokens.shadows.none}`,
  },
  padding: {
    none: 'p-0',
    sm: tokens.spacing.sm,
    md: tokens.spacing.md,
    lg: tokens.spacing.lg,
  },
} as const;

export const badgeVariants = {
  variant: {
    primary: `${tokens.colors.primary[100]} text-primary-800 dark:bg-blue-900/30 dark:text-blue-300`,
    secondary: `${tokens.colors.secondary[100]} text-secondary-800 dark:bg-gray-700 dark:text-gray-300`,
    success: `${tokens.colors.success[100]} text-green-800 dark:bg-green-900/30 dark:text-green-300`,
    warning: `${tokens.colors.warning[100]} text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`,
    danger: `${tokens.colors.danger[100]} text-red-800 dark:bg-red-900/30 dark:text-red-300`,
    info: `${tokens.colors.info[100]} text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300`,
  },
  size: {
    xs: `${tokens.spacingX.xs} ${tokens.spacingY.xs} ${tokens.typography.body.xs}`,
    sm: `${tokens.spacingX.sm} ${tokens.spacingY.xs} ${tokens.typography.body.small}`,
    md: `${tokens.spacingX.md} ${tokens.spacingY.sm} ${tokens.typography.body.base}`,
  },
  dot: 'w-2 h-2 rounded-full',
} as const;

export const layoutVariants = {
  container: {
    fluid: 'w-full',
    sm: 'max-w-sm mx-auto',
    md: 'max-w-md mx-auto',
    lg: 'max-w-lg mx-auto',
    xl: 'max-w-xl mx-auto',
    '2xl': 'max-w-2xl mx-auto',
    '4xl': 'max-w-4xl mx-auto',
    '6xl': 'max-w-6xl mx-auto',
  },
  stack: {
    direction: {
      vertical: 'flex flex-col',
      horizontal: 'flex flex-row',
    },
    spacing: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
  },
  grid: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    },
    gap: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
  },
} as const;

// バリアント型定義
export type ButtonVariant = keyof typeof buttonVariants.variant;
export type ButtonSize = keyof typeof buttonVariants.size;
export type InputVariant = keyof typeof inputVariants.variant;
export type InputSize = keyof typeof inputVariants.size;
export type CardVariant = keyof typeof cardVariants.variant;
export type CardPadding = keyof typeof cardVariants.padding;
export type BadgeVariant = keyof typeof badgeVariants.variant;
export type BadgeSize = keyof typeof badgeVariants.size;
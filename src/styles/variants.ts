/**
 * Component Variants
 * コンポーネントのバリアントスタイルを定義
 */

import { tokens } from './tokens';

export const buttonVariants = {
  variant: {
    primary: `${tokens.colors.primary[500]} hover:${tokens.colors.primary[600]} focus:${tokens.colors.primary[700]}`,
    secondary: `${tokens.colors.secondary[200]} hover:${tokens.colors.secondary[300]} focus:${tokens.colors.secondary[400]}`,
    success: `${tokens.colors.success[500]} hover:${tokens.colors.success[600]} focus:${tokens.colors.success[700]}`,
    warning: `${tokens.colors.warning[500]} hover:${tokens.colors.warning[600]} focus:${tokens.colors.warning[700]}`,
    danger: `${tokens.colors.danger[500]} hover:${tokens.colors.danger[600]} focus:${tokens.colors.danger[700]}`,
    outline: `border-2 border-current bg-transparent hover:bg-current hover:text-white ${tokens.transitions.colors}`,
    ghost: `bg-transparent hover:${tokens.colors.secondary[100]} ${tokens.transitions.colors}`,
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
    default: `${tokens.borders.thin} ${tokens.bordersFocus.primary} ${tokens.colors.secondary[50]}`,
    error: `border-2 border-red-300 ${tokens.bordersFocus.danger} bg-red-50`,
    success: `border-2 border-green-300 ${tokens.bordersFocus.success} bg-green-50`,
  },
  size: {
    sm: `${tokens.spacingX.md} ${tokens.spacingY.sm} ${tokens.typography.body.small}`,
    md: `${tokens.spacingX.md} ${tokens.spacingY.md} ${tokens.typography.body.base}`,
    lg: `${tokens.spacingX.lg} ${tokens.spacingY.lg} ${tokens.typography.body.large}`,
  },
  disabled: 'opacity-50 cursor-not-allowed bg-gray-100',
} as const;

export const cardVariants = {
  variant: {
    default: `${tokens.colors.secondary[50]} ${tokens.borders.thin} ${tokens.shadows.sm}`,
    elevated: `${tokens.colors.secondary[50]} ${tokens.borders.thin} ${tokens.shadows.md}`,
    outlined: `${tokens.colors.secondary[50]} ${tokens.borders.medium} ${tokens.shadows.none}`,
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
    primary: `${tokens.colors.primary[100]} text-primary-800`,
    secondary: `${tokens.colors.secondary[100]} text-secondary-800`,
    success: `${tokens.colors.success[100]} text-green-800`,
    warning: `${tokens.colors.warning[100]} text-yellow-800`,
    danger: `${tokens.colors.danger[100]} text-red-800`,
    info: `${tokens.colors.info[100]} text-cyan-800`,
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
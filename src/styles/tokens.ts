/**
 * Design Tokens
 * アプリケーション全体で使用するデザイントークンを定義
 */

export const tokens = {
  colors: {
    primary: {
      50: 'bg-blue-50 text-blue-950',
      100: 'bg-blue-100 text-blue-900',
      200: 'bg-blue-200 text-blue-800',
      300: 'bg-blue-300 text-blue-700',
      400: 'bg-blue-400 text-blue-600',
      500: 'bg-blue-500 text-white',
      600: 'bg-blue-600 text-white',
      700: 'bg-blue-700 text-white',
      800: 'bg-blue-800 text-white',
      900: 'bg-blue-900 text-white',
      950: 'bg-blue-950 text-white',
    },
    secondary: {
      50: 'bg-gray-50 text-gray-950',
      100: 'bg-gray-100 text-gray-900',
      200: 'bg-gray-200 text-gray-800',
      300: 'bg-gray-300 text-gray-700',
      400: 'bg-gray-400 text-gray-600',
      500: 'bg-gray-500 text-white',
      600: 'bg-gray-600 text-white',
      700: 'bg-gray-700 text-white',
      800: 'bg-gray-800 text-white',
      900: 'bg-gray-900 text-white',
      950: 'bg-gray-950 text-white',
    },
    success: {
      50: 'bg-green-50 text-green-950',
      100: 'bg-green-100 text-green-900',
      500: 'bg-green-500 text-white',
      600: 'bg-green-600 text-white',
      700: 'bg-green-700 text-white',
    },
    warning: {
      50: 'bg-yellow-50 text-yellow-950',
      100: 'bg-yellow-100 text-yellow-900',
      500: 'bg-yellow-500 text-white',
      600: 'bg-yellow-600 text-white',
      700: 'bg-yellow-700 text-white',
    },
    danger: {
      50: 'bg-red-50 text-red-950',
      100: 'bg-red-100 text-red-900',
      500: 'bg-red-500 text-white',
      600: 'bg-red-600 text-white',
      700: 'bg-red-700 text-white',
    },
    info: {
      50: 'bg-cyan-50 text-cyan-950',
      100: 'bg-cyan-100 text-cyan-900',
      500: 'bg-cyan-500 text-white',
      600: 'bg-cyan-600 text-white',
      700: 'bg-cyan-700 text-white',
    },
  },
  spacing: {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4', 
    lg: 'p-6',
    xl: 'p-8',
  },
  spacingX: {
    xs: 'px-1',
    sm: 'px-2',
    md: 'px-4',
    lg: 'px-6', 
    xl: 'px-8',
  },
  spacingY: {
    xs: 'py-1',
    sm: 'py-2',
    md: 'py-4',
    lg: 'py-6',
    xl: 'py-8',
  },
  typography: {
    heading: {
      h1: 'text-3xl font-bold leading-tight',
      h2: 'text-2xl font-semibold leading-tight',
      h3: 'text-xl font-semibold leading-snug',
      h4: 'text-lg font-medium leading-snug',
      h5: 'text-base font-medium leading-normal',
      h6: 'text-sm font-medium leading-normal',
    },
    body: {
      large: 'text-lg leading-relaxed',
      base: 'text-base leading-relaxed',
      small: 'text-sm leading-relaxed',
      xs: 'text-xs leading-relaxed',
    },
  },
  borders: {
    none: 'border-0',
    thin: 'border border-gray-200',
    medium: 'border-2 border-gray-300',
    thick: 'border-4 border-gray-400',
  },
  bordersFocus: {
    primary: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    secondary: 'focus:ring-2 focus:ring-gray-500 focus:border-gray-500',
    success: 'focus:ring-2 focus:ring-green-500 focus:border-green-500',
    warning: 'focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500',
    danger: 'focus:ring-2 focus:ring-red-500 focus:border-red-500',
  },
  shadows: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },
  rounded: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },
  transitions: {
    none: 'transition-none',
    all: 'transition-all duration-200 ease-in-out',
    colors: 'transition-colors duration-200 ease-in-out',
    transform: 'transition-transform duration-200 ease-in-out',
  },
} as const;

// 型定義
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type ColorTone = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type RoundedVariant = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
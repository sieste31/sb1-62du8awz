/**
 * User Domain Types
 * ユーザードメインの型定義
 */

import type { ComponentPropsWithoutRef } from 'react';

// ユーザープランタイプ
export type UserPlan = 'free' | 'premium' | 'business';

// プラン制限情報
export interface PlanLimits {
  maxDevices: number;
  maxBatteries: number;
  maxNotifications: number;
  hasAdvancedAnalytics: boolean;
  hasExport: boolean;
  hasApiAccess: boolean;
}

// ユーザープラン情報
export interface UserPlanInfo {
  plan: UserPlan;
  limits: PlanLimits;
  usage: {
    devices: number;
    batteries: number;
    notifications: number;
  };
  subscriptionEnd?: Date;
  trialEnd?: Date;
}

// UserPlanInfo Props
export interface UserPlanInfoProps extends ComponentPropsWithoutRef<'div'> {
  planInfo: UserPlanInfo;
  onUpgrade?: () => void;
  onManage?: () => void;
  showUsage?: boolean;
  compact?: boolean;
}

// UserPlanLimitIndicator Props
export interface UserPlanLimitIndicatorProps extends ComponentPropsWithoutRef<'div'> {
  label: string;
  current: number;
  max: number;
  unit?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}
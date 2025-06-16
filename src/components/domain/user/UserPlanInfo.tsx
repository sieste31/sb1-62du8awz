/**
 * UserPlanInfo Component
 * ユーザープラン情報表示コンポーネント
 */

import React, { forwardRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter, Button, Badge, Stack } from '@/components/primitives';
import { UserPlanLimitIndicator } from './UserPlanLimitIndicator';
import { tokens } from '@/styles/tokens';
import { cn } from '@/styles/utils';
import type { UserPlanInfoProps, UserPlan } from './types';

// プラン設定
const planConfig: Record<UserPlan, {
  label: string;
  icon: string;
  color: 'success' | 'info' | 'warning';
  description: string;
}> = {
  free: {
    label: 'フリープラン',
    icon: '🆓',
    color: 'success',
    description: '基本機能を無料でご利用いただけます'
  },
  premium: {
    label: 'プレミアムプラン',
    icon: '⭐',
    color: 'info',
    description: '高度な分析とより多くのデバイス管理'
  },
  business: {
    label: 'ビジネスプラン',
    icon: '🏢',
    color: 'warning',
    description: 'API アクセスと無制限の機能'
  }
};

// 日付フォーマット
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// 残り日数計算
const getDaysRemaining = (date: Date): number => {
  const diff = date.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const UserPlanInfo = forwardRef<HTMLDivElement, UserPlanInfoProps>(
  (
    {
      planInfo,
      onUpgrade,
      onManage,
      showUsage = true,
      compact = false,
      className,
      ...props
    },
    ref
  ) => {
    const config = planConfig[planInfo.plan];
    const isTrialing = planInfo.trialEnd && planInfo.trialEnd > new Date();
    const isExpiring = planInfo.subscriptionEnd && 
      getDaysRemaining(planInfo.subscriptionEnd) <= 7;

    return (
      <Card
        ref={ref}
        className={cn(
          'border-2',
          planInfo.plan === 'business' && 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50',
          planInfo.plan === 'premium' && 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50',
          planInfo.plan === 'free' && 'border-gray-200',
          className
        )}
        {...props}
      >
        <CardHeader className={cn(compact && 'pb-3')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className={cn(
                    tokens.typography.heading.h4,
                    'text-gray-900'
                  )}>
                    {config.label}
                  </h3>
                  
                  {isTrialing && (
                    <Badge variant="info" size="sm">
                      トライアル中
                    </Badge>
                  )}
                </div>
                
                {!compact && (
                  <p className={cn(
                    tokens.typography.body.small,
                    'text-gray-600 mt-1'
                  )}>
                    {config.description}
                  </p>
                )}
              </div>
            </div>

            <Badge variant={config.color}>
              {config.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 期限情報 */}
          {(planInfo.trialEnd || planInfo.subscriptionEnd) && (
            <div className={cn(
              'p-3 rounded-lg',
              isTrialing 
                ? 'bg-blue-50 border border-blue-200'
                : isExpiring
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-gray-50 border border-gray-200'
            )}>
              {isTrialing ? (
                <div>
                  <p className={cn(
                    tokens.typography.body.small,
                    'font-medium text-blue-800'
                  )}>
                    トライアル期間
                  </p>
                  <p className={cn(
                    tokens.typography.body.small,
                    'text-blue-700'
                  )}>
                    {formatDate(planInfo.trialEnd!)} まで
                    （残り {getDaysRemaining(planInfo.trialEnd!)} 日）
                  </p>
                </div>
              ) : planInfo.subscriptionEnd && (
                <div>
                  <p className={cn(
                    tokens.typography.body.small,
                    'font-medium',
                    isExpiring ? 'text-red-800' : 'text-gray-800'
                  )}>
                    次回更新日
                  </p>
                  <p className={cn(
                    tokens.typography.body.small,
                    isExpiring ? 'text-red-700' : 'text-gray-700'
                  )}>
                    {formatDate(planInfo.subscriptionEnd)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 使用状況 */}
          {showUsage && (
            <div className="space-y-3">
              <h4 className={cn(
                tokens.typography.body.medium,
                'font-medium text-gray-900'
              )}>
                使用状況
              </h4>
              
              <Stack spacing="sm">
                <UserPlanLimitIndicator
                  label="デバイス"
                  current={planInfo.usage.devices}
                  max={planInfo.limits.maxDevices}
                  unit="台"
                  size={compact ? 'sm' : 'md'}
                />
                
                <UserPlanLimitIndicator
                  label="電池"
                  current={planInfo.usage.batteries}
                  max={planInfo.limits.maxBatteries}
                  unit="個"
                  size={compact ? 'sm' : 'md'}
                />
                
                <UserPlanLimitIndicator
                  label="通知設定"
                  current={planInfo.usage.notifications}
                  max={planInfo.limits.maxNotifications}
                  unit="件"
                  size={compact ? 'sm' : 'md'}
                />
              </Stack>
            </div>
          )}

          {/* 機能一覧 */}
          {!compact && (
            <div className="space-y-2">
              <h4 className={cn(
                tokens.typography.body.medium,
                'font-medium text-gray-900'
              )}>
                利用可能な機能
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className={planInfo.limits.hasAdvancedAnalytics ? '✅' : '❌'}>
                  </span>
                  <span>高度な分析</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={planInfo.limits.hasExport ? '✅' : '❌'}>
                  </span>
                  <span>データエクスポート</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={planInfo.limits.hasApiAccess ? '✅' : '❌'}>
                  </span>
                  <span>API アクセス</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* アクションボタン */}
        {(onUpgrade || onManage) && (
          <CardFooter>
            <Stack direction="horizontal" spacing="sm" justify="end">
              {onManage && (
                <Button
                  variant="secondary"
                  size={compact ? 'sm' : 'md'}
                  onClick={onManage}
                >
                  プラン管理
                </Button>
              )}
              
              {onUpgrade && planInfo.plan !== 'business' && (
                <Button
                  variant="primary"
                  size={compact ? 'sm' : 'md'}
                  onClick={onUpgrade}
                >
                  {planInfo.plan === 'free' ? 'アップグレード' : 'ビジネスプランへ'}
                </Button>
              )}
            </Stack>
          </CardFooter>
        )}
      </Card>
    );
  }
);

UserPlanInfo.displayName = 'UserPlanInfo';
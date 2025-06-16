// 電池一覧画面のコンポーネント

import React from 'react';
import { Battery, Plus, AlertCircle } from 'lucide-react';
import { LoadingSpinner, Card, Button, Grid } from '@/components/primitives';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBatteryGroups, useUserPlan } from '@/lib/hooks';
import type { Database } from '@/lib/database.types';
import { BatteryListItem } from './BatteryListItem';
import { BatteryListFilter } from './BatteryListFilter';
import { BatteryListFilterButton } from './BatteryListFilterButton';
import { useBatteryFilterStore } from '@/lib/batteryFilterStore';
import { getActualPlanLimits } from '@/lib/planUtils';
import { useDemoMode } from '@/components/Demo/DemoModeContext';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
  batteries?: (Database['public']['Tables']['batteries']['Row'] & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
  })[];
};

interface BatteryListProps {
  isDemoMode?: boolean;
}

export function BatteryList({ isDemoMode = false }: BatteryListProps) {
  const { t } = useTranslation();
  const { batteryGroups: defaultBatteryGroups, loading } = useBatteryGroups();
  const { batteryGroups: demoBatteryGroups } = isDemoMode ? useDemoMode() : { batteryGroups: [] };

  const batteryGroups = isDemoMode ? demoBatteryGroups : defaultBatteryGroups;

  // Zustandストアから状態と関数を取得
  const {
    getFilteredAndSortedGroups
  } = useBatteryFilterStore();

  // フィルタリングとソート
  const filteredAndSortedGroups = getFilteredAndSortedGroups(batteryGroups);

  if (loading) {
    return <LoadingSpinner centered />;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">{t('battery.list.title')}</h2>
          <div className="flex flex-wrap items-center gap-3">
            <BatteryListFilterButton />
            {!isDemoMode && <BatteryAddButton batteryGroups={batteryGroups} />}
          </div>
        </div>
        {/* ユーザープラン情報表示 */}
        {!isDemoMode && <UserPlanInfoSection batteryGroups={batteryGroups} />}
        <BatteryListFilter />
      </div>

      <Card className="overflow-hidden">
        {filteredAndSortedGroups.length === 0 ? (
          <div className="text-center py-16">
            <Battery className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-dark-text">
              {batteryGroups.length === 0 ? t('battery.list.noBatteries') : t('battery.list.noMatchingBatteries')}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {batteryGroups.length === 0
                ? t('battery.list.emptyStateMessage')
                : t('battery.list.noMatchingMessage')}
            </p>
            {!isDemoMode && batteryGroups.length === 0 && (
              <div className="mt-6">
                <Link to="/app/batteries/new">
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    {t('battery.list.addNew')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 sm:p-6">
            <Grid 
              cols={1} 
              responsive={{ md: 2, lg: 2 }} 
              gap="lg"
            >
              {filteredAndSortedGroups.map((group) => (
                <BatteryListItem key={group.id} group={group} isDemoMode={isDemoMode} />
              ))}
            </Grid>
          </div>
        )}
      </Card>
    </div>
  );
}

// 電池グループ追加ボタンコンポーネント
function BatteryAddButton({ batteryGroups }: { batteryGroups: BatteryGroup[] }) {
  const { t } = useTranslation();
  const { isLimitReached } = useUserPlan();
  const isBatteryGroupLimitReached = isLimitReached.batteryGroups(batteryGroups.length);

  if (isBatteryGroupLimitReached) {
    return (
      <Button
        disabled
        variant="secondary"
        size="sm"
        leftIcon={<Plus className="h-4 w-4" />}
      >
        {t('battery.list.addNew')}
      </Button>
    );
  }

  return (
    <Link to="/app/batteries/new">
      <Button
        variant="primary"
        size="sm"
        leftIcon={<Plus className="h-4 w-4" />}
      >
        {t('battery.list.addNew')}
      </Button>
    </Link>
  );
}

// ユーザープラン情報表示コンポーネント（簡略版）
function UserPlanInfoSection({ batteryGroups }: { batteryGroups: BatteryGroup[] }) {
  const { t } = useTranslation();
  const { userPlan, loading } = useUserPlan();
  const navigate = useNavigate();

  if (loading || !userPlan) return null;

  const batteryGroupCount = batteryGroups.length;
  const actualLimits = getActualPlanLimits(userPlan);
  const maxBatteryGroups = actualLimits.batteryGroups;
  const isLimitReached = batteryGroupCount >= maxBatteryGroups;

  // TODO: 将来的にはドメインコンポーネントのUserPlanInfoを使用
  // 現在は既存のUIを維持しつつボタンのみ新コンポーネント化
  return (
    <div className={`p-4 rounded-lg mb-4 ${isLimitReached ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          {isLimitReached && (
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`text-sm mt-1 ${isLimitReached ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
              {t('battery.list.groupCount', { current: batteryGroupCount, max: maxBatteryGroups })}
              {isLimitReached && ` ${t('battery.list.limitReachedSettings')}`}
            </p>
          </div>
        </div>
        {isLimitReached && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/settings')}
          >
            {t('battery.list.changeInSettings')}
          </Button>
        )}
      </div>
    </div>
  );
}

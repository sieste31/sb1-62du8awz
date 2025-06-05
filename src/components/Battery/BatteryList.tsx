// 電池一覧画面のコンポーネント

import React from 'react';
import { Battery, Plus, Filter, Search, SortDesc, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import { useBatteryGroups, useUserPlan } from '@/lib/hooks';
import type { Database } from '@/lib/database.types';
import { BatteryListItem } from './BatteryListItem';
import { BatteryListFilter } from './BatteryListFilter';
import { BatteryListFilterButton } from './BatteryListFilterButton';
import {
  useBatteryFilterStore,
  SORT_OPTIONS
} from '@/lib/batteryFilterStore';
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
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const batteryGroups = isDemoMode ? demoBatteryGroups : defaultBatteryGroups;

  // Zustandストアから状態と関数を取得
  const {
    getFilteredAndSortedGroups
  } = useBatteryFilterStore();

  // フィルタリングとソート
  const filteredAndSortedGroups = getFilteredAndSortedGroups(batteryGroups);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
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
        {!isDemoMode && <UserPlanInfo batteryGroups={batteryGroups} />}
        <BatteryListFilter />
      </div>

      <div className="bg-white dark:bg-dark-card shadow rounded-xl overflow-hidden">
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
                <Link
                  to="/app/batteries/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('battery.list.addNew')}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredAndSortedGroups.map((group) => (
                <BatteryListItem key={group.id} group={group} isDemoMode={isDemoMode} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 電池グループ追加ボタンコンポーネント
function BatteryAddButton({ batteryGroups }: { batteryGroups: BatteryGroup[] }) {
  const { t } = useTranslation();
  const { userPlan, isLimitReached } = useUserPlan();
  const isBatteryGroupLimitReached = isLimitReached.batteryGroups(batteryGroups.length);

  if (isBatteryGroupLimitReached) {
    return (
      <div className="relative inline-block">
        <button
          disabled
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('battery.list.addNew')}
        </button>
      </div>
    );
  }

  return (
    <Link
      to="/app/batteries/new"
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Plus className="h-4 w-4 mr-2" />
      {t('battery.list.addNew')}
    </Link>
  );
}

// ユーザープラン情報表示コンポーネント
function UserPlanInfo({ batteryGroups }: { batteryGroups: BatteryGroup[] }) {
  const { t } = useTranslation();
  const { userPlan, loading } = useUserPlan();
  const navigate = useNavigate();

  if (loading || !userPlan) return null;

  const batteryGroupCount = batteryGroups.length;
  const actualLimits = getActualPlanLimits(userPlan);
  const maxBatteryGroups = actualLimits.batteryGroups;
  const isLimitReached = batteryGroupCount >= maxBatteryGroups;
  const planTypeDisplay = userPlan.plan_type === 'free' ? t('plan.free') :
    userPlan.plan_type === 'standard' ? t('plan.standard') : t('plan.pro');

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
          <button
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => navigate('/settings')}
          >
            {t('battery.list.changeInSettings')}
          </button>
        )}
      </div>
    </div>
  );
}

// 電池一覧画面のコンポーネント

import React from 'react';
import { Battery, Plus, Filter, Search, SortDesc, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
// 新しい構造を使用
import { useBatteryGroups, useUserPlan } from '@/lib/hooks';
// 注: 上記のインポートは内部的に store.ts の useBatteryGroupsStore と useUserPlanStore を使用しています
import type { Database } from '@/lib/database.types';
import { BatteryListItem } from './BatteryListItem';
import { BatteryListFilter } from './BatteryListFilter';
import { BatteryListFilterButton } from './BatteryListFilterButton';
import { 
  useBatteryFilterStore, 
  SORT_OPTIONS 
} from '@/lib/batteryFilterStore';


type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
  batteries?: (Database['public']['Tables']['batteries']['Row'] & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
  })[];
};


export function BatteryList() {
  const { batteryGroups, loading } = useBatteryGroups();
  const isDesktop = useMediaQuery({ minWidth: 768 });
  
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
          <h2 className="text-xl font-semibold text-gray-900">電池一覧</h2>
          <div className="flex flex-wrap items-center gap-3">
            <BatteryListFilterButton />
            <BatteryAddButton batteryGroups={batteryGroups} />
          </div>
        </div>
        {/* ユーザープラン情報表示 */}
        <UserPlanInfo batteryGroups={batteryGroups} />
        <BatteryListFilter />
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        {filteredAndSortedGroups.length === 0 ? (
          <div className="text-center py-16">
            <Battery className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {batteryGroups.length === 0 ? '電池がありません' : '条件に一致する電池がありません'}
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              {batteryGroups.length === 0 
                ? '新しい電池を登録して、効率的に管理を始めましょう。' 
                : '検索条件やフィルター設定を変更して、再度お試しください。'}
            </p>
            {batteryGroups.length === 0 && (
              <div className="mt-6">
                <Link
                  to="/batteries/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新規登録
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredAndSortedGroups.map((group) => (
                <BatteryListItem key={group.id} group={group} />
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
          新規登録
        </button>
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2">
          電池グループの上限に達しています
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to="/batteries/new"
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Plus className="h-4 w-4 mr-2" />
      新規登録
    </Link>
  );
}

// ユーザープラン情報表示コンポーネント
function UserPlanInfo({ batteryGroups }: { batteryGroups: BatteryGroup[] }) {
  const { userPlan, loading } = useUserPlan();

  if (loading || !userPlan) return null;

  const batteryGroupCount = batteryGroups.length;
  const maxBatteryGroups = userPlan.max_battery_groups;
  const isLimitReached = batteryGroupCount >= maxBatteryGroups;
  const planTypeDisplay = userPlan.plan_type === 'free' ? '無料' : 
                          userPlan.plan_type === 'premium' ? 'プレミアム' : 'ビジネス';

  return (
    <div className={`p-4 rounded-lg mb-4 ${isLimitReached ? 'bg-amber-50' : 'bg-blue-50'}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          {isLimitReached && (
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`text-sm mt-1 ${isLimitReached ? 'text-amber-600' : 'text-blue-600'}`}>
              電池グループ: {batteryGroupCount} / {maxBatteryGroups}
              {isLimitReached && ' (上限に達しています)'}
            </p>
          </div>
        </div>
        {userPlan.plan_type === 'free' && (
          <button
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => alert('この機能は現在開発中です。')}
          >
            アップグレード
          </button>
        )}
      </div>
    </div>
  );
}

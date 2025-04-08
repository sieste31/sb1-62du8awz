import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateQueries } from './query';

/**
 * 後方互換性のためのエクスポート
 * 
 * 注: このファイルは主にUIロジックに関連するフックを提供します。
 * データフェッチングは query.ts で、状態管理は store.ts で行います。
 * 
 * 既存のコードとの互換性のために、以下のインポートを提供します：
 * - データフェッチング関連のフックは store.ts からインポートしてください
 * - クエリの無効化は query.ts からインポートしてください
 */
export { 
  useBatteryGroupsStore as useBatteryGroups,
  useBatteryGroupStore as useBatteryGroup,
  useDevicesStore as useDevices,
  useDeviceStore as useDevice,
  useUserPlanStore as useUserPlan,
  useAvailableBatteriesStore as useAvailableBatteries
} from './store';

/**
 * デバイスに装着されている電池の数を取得するフック
 * 
 * 注: このフックはUIロジックに特化しており、
 * 実際のデータフェッチングはstore.tsのuseDeviceStoreで行われます
 */
export function useDeviceBatteries(deviceId: string) {
  const { batteries, loading } = useDeviceStore(deviceId);
  
  return {
    batteries,
    installedCount: batteries?.length || 0,
    loading,
  };
}

/**
 * ダークモードの状態を管理するフック
 * 
 * システムの設定を初期値として使用し、
 * ユーザーの選択をローカルストレージに保存します
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // ローカルストレージから設定を読み込む
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    // システムの設定をデフォルトとして使用
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // ダークモードの切り替え
    document.documentElement.classList.toggle('dark', isDark);
    // 設定を保存
    localStorage.setItem('darkMode', String(isDark));
  }, [isDark]);

  return {
    isDark,
    toggle: () => setIsDark(prev => !prev),
    enable: () => setIsDark(true),
    disable: () => setIsDark(false),
  };
}

/**
 * クエリキャッシュを無効化するユーティリティ関数
 * 後方互換性のために残しています
 */
export function invalidateQueriesCompat(queryClient: ReturnType<typeof useQueryClient>) {
  return invalidateQueries(queryClient);
}

// 循環参照を避けるための内部インポート
import { useDeviceStore } from './store';

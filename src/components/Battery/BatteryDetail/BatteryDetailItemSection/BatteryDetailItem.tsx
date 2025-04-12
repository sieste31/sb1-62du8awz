// 電池詳細画面の電池アイテムコンポーネント

import React, { useState } from 'react';
import { Smartphone, History, Battery, ChevronDown, Check, Unplug } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BatteryUsageHistory } from '../../BatteryUsageHistory';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import type { Database } from '@/lib/database.types';
import { useAuth } from '@/lib/auth-provider';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { updateBatteryStatus } from '@/lib/api';

type Battery = Database['public']['Tables']['batteries']['Row'] & {
  devices?: Database['public']['Tables']['devices']['Row'] | null;
};

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'];

type BatteryStatus = 'charged' | 'in_use' | 'empty' | 'disposed';

const batteryStatusColors = {
  charged: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
  in_use: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  empty: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  disposed: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
} as const;

// 状態に応じたアイコンの色
const batteryStatusIconColors = {
  charged: 'text-green-500',
  in_use: 'text-blue-500',
  empty: 'text-yellow-500',
  disposed: 'text-red-500'
};

interface BatteryItemProps {
  battery: Battery;
  batteryGroup: BatteryGroup;
  setError: (error: string) => void;
}

export function BatteryDetailItem({ battery, batteryGroup, setError }: BatteryItemProps) {
  const { t } = useTranslation();
  const [showHistory, setShowHistory] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);
  const { user } = useAuth();
  const removeBatteryFromDevice = useBatteryDetailStore(state => state.removeBatteryFromDevice);

  // 電池取り外し処理
  const handleRemoveBattery = async () => {
    if (!battery.device_id) return;

    try {
      setRemoving(true);
      await removeBatteryFromDevice(battery.id);
      setShowRemoveConfirm(false);
      // 成功後の処理
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('battery.detail.item.removeError'));
    } finally {
      setRemoving(false);
    }
  };

  const handleBatteryStatusChange = async (batteryId: string, newStatus: BatteryStatus) => {
    if (!user) return;
    if (batteryGroup.kind === 'disposable' && newStatus === 'charged') {
      return; // 使い切り電池は充電済みに変更できない
    }

    try {
      await updateBatteryStatus(batteryId, newStatus);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('battery.detail.item.updateStatusError'));
    }
  };

  // 状態に応じたカードのスタイルを取得
  const getCardStyle = () => {
    const status = battery.status as BatteryStatus;
    return `border-l-4 ${batteryStatusColors[status].split(' ')[2] || 'border-gray-200'}`;
  };

  return (
    <div className={`bg-white dark:bg-dark-card rounded-lg shadow-sm border ${getCardStyle()} p-4 transition-all hover:shadow-md`}>
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Battery className={`h-5 w-5 mr-2 ${batteryStatusIconColors[battery.status as BatteryStatus]}`} />
          <h4 className="text-base font-medium text-gray-900 dark:text-dark-text">
            #{battery.slot_number}
          </h4>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${batteryStatusColors[battery.status as BatteryStatus]}`}>
          {t(`battery.status.${battery.status}`)}
        </div>
        {/* 状態変更ボタン */}
        <button
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {t('battery.detail.item.changeStatus')}
        </button>
      </div>

      {/* メイン情報 */}
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">{t('battery.detail.item.installationStatus')}:</dt>
            <dd className="text-sm flex-1 truncate max-w-[150px] flex items-center">
              {battery.device_id && battery.devices ? (
                <>
                  <Link
                    to={`/devices/${battery.devices.id}`}
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group"
                  >
                    <span className="group-hover:underline truncate">{battery.devices.name}</span>
                  </Link>
                </>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">{t('battery.detail.item.notInstalled')}</span>
              )}
            </dd>
          </div>
        </div>
      </div>

      {/* 状態変更ダイアログ */}
      {showStatusDropdown && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setShowStatusDropdown(false)}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div
              className="inline-block align-bottom bg-white dark:bg-dark-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-3">
                  {t('battery.detail.item.changeStatusTitle', { number: battery.slot_number })}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['charged', 'in_use', 'empty', 'disposed'] as BatteryStatus[]).map((status) => {
                    const isDisabled = batteryGroup.kind === 'disposable' && status === 'charged';
                    const isSelected = battery.status === status;

                    return (
                      <button
                        key={status}
                        onClick={() => {
                          if (!isDisabled) {
                            handleBatteryStatusChange(battery.id, status);
                            setShowStatusDropdown(false);
                          }
                        }}
                        disabled={isDisabled}
                        className={`px-4 py-3 rounded-md text-sm font-medium flex items-center justify-center ${isDisabled
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : isSelected
                            ? batteryStatusColors[status]
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                      >
                        {t(`battery.status.${status}`)}
                        {isSelected && <Check className="h-4 w-4 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-dark-card text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowStatusDropdown(false)}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* フッター部分 */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div>
          <div>{t('battery.detail.item.lastChecked')}: {battery.last_checked ? new Date(battery.last_checked).toLocaleDateString() : '---'}</div>
          <div>{t('battery.detail.item.lastChanged')}: {battery.last_changed_at ? new Date(battery.last_changed_at).toLocaleDateString() : '---'}</div>
        </div>
        {battery.device_id && battery.devices ? (
          <button
            onClick={() => setShowRemoveConfirm(true)}
            className="ml-2 inline-flex items-center p-1 rounded-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            title={t('battery.detail.item.removeFromDevice')}
          >
            <Unplug className="h-4 w-4" />
          </button>
        ) : (<></>)}
        <button
          onClick={() => setShowHistory(true)}
          className="inline-flex items-center p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
          title={t('battery.detail.item.usageHistory')}
        >
          <History className="h-4 w-4" />
        </button>
      </div>

      <BatteryUsageHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        batteryId={battery.id}
        batteryName={`${batteryGroup.name} #${battery.slot_number}`}
      />

      {/* 電池取り外し確認ダイアログ */}
      <DeleteConfirmDialog
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        onConfirm={handleRemoveBattery}
        title={t('battery.detail.item.removeFromDevice')}
        message={t('battery.detail.item.removeConfirmMessage', { deviceName: battery.devices?.name })}
        confirmText={t('battery.detail.item.removeConfirm')}
        cancelText={t('common.cancel')}
        loading={removing}
      />
    </div>
  );
}

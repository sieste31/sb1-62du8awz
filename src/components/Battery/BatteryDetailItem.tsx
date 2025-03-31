// 電池詳細画面の電池アイテムコンポーネント

import React, { useState } from 'react';
import { Smartphone, History, Battery, ChevronDown, Check, Unplug } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BatteryUsageHistory } from './BatteryUsageHistory';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import type { Database } from '@/lib/database.types';
import { useAuth } from '@/lib/auth-provider';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { updateBatteryStatus } from '@/lib/api';

type Battery = Database['public']['Tables']['batteries']['Row'] & {
  devices?: Database['public']['Tables']['devices']['Row'] | null;
};

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'];

type BatteryStatus = 'charged' | 'in_use' | 'empty' | 'disposed';

const batteryStatusLabels = {
  charged: '満充電',
  in_use: '使用中',
  empty: '使用済み',
  disposed: '廃棄'
} as const;

const batteryStatusColors = {
  charged: 'bg-green-100 text-green-800 border-green-200',
  in_use: 'bg-blue-100 text-blue-800 border-blue-200',
  empty: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  disposed: 'bg-red-100 text-red-800 border-red-200'
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
      setError(err instanceof Error ? err.message : '電池の取り外しに失敗しました');
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
      setError(err instanceof Error ? err.message : '電池の状態の更新に失敗しました');
    }
  };

  // 状態に応じたカードのスタイルを取得
  const getCardStyle = () => {
    const status = battery.status as BatteryStatus;
    return `border-l-4 ${batteryStatusColors[status].split(' ')[2] || 'border-gray-200'}`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${getCardStyle()} p-4 transition-all hover:shadow-md`}>
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Battery className={`h-5 w-5 mr-2 ${batteryStatusIconColors[battery.status as BatteryStatus]}`} />
          <h4 className="text-base font-medium text-gray-900">
            #{battery.slot_number}
          </h4>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${batteryStatusColors[battery.status as BatteryStatus]}`}>
          {batteryStatusLabels[battery.status as BatteryStatus]}
        </div>
        {/* 状態変更ボタン */}
        <button
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          状態変更
        </button>
      </div>

      {/* メイン情報 */}
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <dt className="text-sm font-medium text-gray-500 mr-2">設置状況:</dt>
            <dd className="text-sm flex-1 truncate max-w-[150px] flex items-center">
              {battery.device_id && battery.devices ? (
                <>
                  <Link
                    to={`/devices/${battery.devices.id}`}
                    className="flex items-center text-blue-600 hover:text-blue-800 group"
                  >
                    <span className="group-hover:underline truncate">{battery.devices.name}</span>
                  </Link>
                </>
              ) : (
                <span className="text-gray-500">未設置</span>
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
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  電池 #{battery.slot_number} の状態を変更
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(batteryStatusLabels).map(([status, label]) => {
                    const isDisabled = batteryGroup.kind === 'disposable' && status === 'charged';
                    const isSelected = battery.status === status;

                    return (
                      <button
                        key={status}
                        onClick={() => {
                          if (!isDisabled) {
                            handleBatteryStatusChange(battery.id, status as BatteryStatus);
                            setShowStatusDropdown(false);
                          }
                        }}
                        disabled={isDisabled}
                        className={`px-4 py-3 rounded-md text-sm font-medium flex items-center justify-center ${isDisabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isSelected
                            ? batteryStatusColors[status as BatteryStatus]
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {label}
                        {isSelected && <Check className="h-4 w-4 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowStatusDropdown(false)}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* フッター部分 */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
        <div>
          <div>最終チェック: {battery.last_checked ? new Date(battery.last_checked).toLocaleDateString() : '---'}</div>
          <div>最終交換: {battery.last_changed_at ? new Date(battery.last_changed_at).toLocaleDateString() : '---'}</div>
        </div>
        {battery.device_id && battery.devices ? (
          <button
            onClick={() => setShowRemoveConfirm(true)}
            className="ml-2 inline-flex items-center p-1 rounded-full text-red-600 hover:bg-red-50"
            title="デバイスから取り外す"
          >
            <Unplug className="h-4 w-4" />
          </button>
        ) : (<></>)}
        <button
          onClick={() => setShowHistory(true)}
          className="inline-flex items-center p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          title="使用履歴"
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
        title="電池の取り外し"
        message={`${battery.devices?.name}から電池を取り外しますか？`}
        confirmText="取り外す"
        cancelText="キャンセル"
        loading={removing}
      />
    </div>
  );
}

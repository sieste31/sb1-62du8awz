'use client';

import React, { useState } from 'react';
import { Smartphone, History } from 'lucide-react';
import Link from 'next/link';
import { BatteryUsageHistory } from './BatteryUsageHistory';
import type { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-provider';

type Battery = Database['public']['Tables']['batteries']['Row'] & {
  devices?: Database['public']['Tables']['devices']['Row'] | null;
};

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'];

const batteryStatusLabels = {
  charged: '満充電',
  in_use: '使用中',
  empty: '使用済み',
  disposed: '廃棄'
} as const;

const batteryStatusColors = {
  charged: 'bg-green-100 text-green-800',
  in_use: 'bg-blue-100 text-blue-800',
  empty: 'bg-yellow-100 text-yellow-800',
  disposed: 'bg-red-100 text-red-800'
} as const;

interface BatteryItemProps {
  battery: Battery;
  batteryGroup: BatteryGroup;
  setError: (error: string) => void;
}

export function BatteryDetailItem({ battery, batteryGroup, setError }: BatteryItemProps) {
  const [showHistory, setShowHistory] = useState(false);
  const { user } = useAuth();
  
  const handleBatteryStatusChange = async (batteryId: string, newStatus: 'charged' | 'in_use' | 'empty' | 'disposed') => {
    if (!user) return;
    if (batteryGroup.kind === 'disposable' && newStatus === 'charged') {
      return; // 使い切り電池は充電済みに変更できない
    }

    try {
      const now = new Date().toISOString();
      const updates: {
        status: string;
        last_checked: string;
        last_changed_at?: string;
      } = {
        status: newStatus,
        last_checked: now,
      };

      // 充電済みまたは使用中に変更する場合は交換日も更新
      if (newStatus === 'charged' || newStatus === 'in_use') {
        updates.last_changed_at = now;
      }

      const { error: updateError } = await supabase
        .from('batteries')
        .update(updates)
        .eq('id', batteryId);

      if (updateError) throw updateError;

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : '電池の状態の更新に失敗しました');
    }
  };

  return (
    <div className="px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900">
          {batteryGroup.name} #{battery.slot_number}
        </h4>
        <div className="flex flex-col items-end text-sm text-gray-500">
          <span>
            最終チェック日: {battery.last_checked ? new Date(battery.last_checked).toLocaleDateString() : '---'}
          </span>
          <span>
            最終交換日: {battery.last_changed_at ? new Date(battery.last_changed_at).toLocaleDateString() : '---'}
          </span>
        </div>
      </div>

      {/* 設置状況 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <dt className="text-sm font-medium text-gray-500 mr-2">設置状況:</dt>
          <dd className="text-sm">
            {battery.device_id && battery.devices ? (
              <Link 
                href={`/devices/${battery.devices.id}`}
                className="flex items-center text-blue-600 hover:text-blue-800 group"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                <span className="group-hover:underline">{battery.devices.name}に設置中</span>
              </Link>
            ) : (
              <span className="text-gray-500">未設置</span>
            )}
          </dd>
        </div>
        <button
          onClick={() => setShowHistory(true)}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <History className="h-4 w-4 mr-1" />
          使用履歴
        </button>
      </div>

      {/* 電池の状態 */}
      <div className="flex items-center justify-end">
        <div className="flex space-x-2">
          {Object.entries(batteryStatusLabels).map(([status, label]) => (
            <button
              key={status}
              onClick={() => handleBatteryStatusChange(battery.id, status as any)}
              disabled={batteryGroup.kind === 'disposable' && status === 'charged'}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                battery.status === status
                  ? batteryStatusColors[status as keyof typeof batteryStatusColors]
                  : batteryGroup.kind === 'disposable' && status === 'charged'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <BatteryUsageHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        batteryId={battery.id}
        batteryName={`${batteryGroup.name} #${battery.slot_number}`}
      />
    </div>
  );
}
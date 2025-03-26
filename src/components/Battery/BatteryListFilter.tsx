// 電池一覧画面のフィルターを表示するコンポーネント

'use client';

import React from 'react';
import { Battery, Zap } from 'lucide-react';

const BATTERY_TYPES = ['すべて', '単1形', '単2形', '単3形', '単4形', '9V形'] as const;
const BATTERY_KINDS = ['すべて', 'disposable', 'rechargeable'] as const;

const batteryKindLabels = {
  'すべて': 'すべて',
  'disposable': '使い切り',
  'rechargeable': '充電池',
} as const;

const batteryKindIcons = {
  'すべて': null,
  'disposable': null,
  'rechargeable': <Zap className="h-3 w-3 mr-1" />,
} as const;

interface BatteryFilterProps {
  selectedType: typeof BATTERY_TYPES[number];
  setSelectedType: (type: typeof BATTERY_TYPES[number]) => void;
  selectedKind: typeof BATTERY_KINDS[number];
  setSelectedKind: (kind: typeof BATTERY_KINDS[number]) => void;
}

export function BatteryListFilter({ selectedType, setSelectedType, selectedKind, setSelectedKind }: BatteryFilterProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Battery className="h-4 w-4 mr-1.5 text-gray-500" />
            電池種別
          </label>
          <div className="flex flex-wrap gap-2">
            {BATTERY_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-300'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Zap className="h-4 w-4 mr-1.5 text-gray-500" />
            電池タイプ
          </label>
          <div className="flex flex-wrap gap-2">
            {BATTERY_KINDS.map((kind) => (
              <button
                key={kind}
                onClick={() => setSelectedKind(kind)}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedKind === kind
                    ? kind === 'rechargeable' 
                      ? 'bg-green-100 text-green-800 ring-1 ring-green-300' 
                      : kind === 'disposable'
                        ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                        : 'bg-blue-100 text-blue-800 ring-1 ring-blue-300'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {batteryKindIcons[kind]}
                {batteryKindLabels[kind]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

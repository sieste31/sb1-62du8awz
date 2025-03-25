// 電池一覧画面のフィルターを表示するコンポーネント

'use client';

import React, { useState } from 'react';

const BATTERY_TYPES = ['すべて', '単1形', '単2形', '単3形', '単4形', '9V形'] as const;
const BATTERY_KINDS = ['すべて', 'disposable', 'rechargeable'] as const;

const batteryKindLabels = {
    'すべて': 'すべて',
    'disposable': '使い切り',
    'rechargeable': '充電池',
  } as const;

interface BatteryFilterProps {
    selectedType: typeof BATTERY_TYPES[number];
    setSelectedType: (type: typeof BATTERY_TYPES[number]) => void;
    selectedKind: typeof BATTERY_KINDS[number];
    setSelectedKind: (kind: typeof BATTERY_KINDS[number]) => void;
}

export function BatteryListFilter({ selectedType, setSelectedType, selectedKind, setSelectedKind }: BatteryFilterProps) {

    return (<div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    電池種別
                </label>
                <div className="flex flex-wrap gap-2">
                    {BATTERY_TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${selectedType === type
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    電池タイプ
                </label>
                <div className="flex flex-wrap gap-2">
                    {BATTERY_KINDS.map((kind) => (
                        <button
                            key={kind}
                            onClick={() => setSelectedKind(kind)}
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${selectedKind === kind
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            {batteryKindLabels[kind]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>);
}
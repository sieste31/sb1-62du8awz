// 電池詳細画面とデバイス詳細画面で共通で使用するコンポーネント

import React from 'react';

interface DetailInfoElemHeadProps {
    title: string;
}

export function  DetailInfoElemHead({title} : DetailInfoElemHeadProps) {
    return (
        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{title}</dt>
    );
};

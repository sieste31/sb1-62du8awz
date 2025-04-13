// 電池詳細画面とデバイス詳細画面で共通で使用するコンポーネント

import React from 'react';

interface DetailInfoElemTextProps {
    children: React.ReactNode;
}

export function DetailInfoElemText(prop: DetailInfoElemTextProps) {
    return (
        <span className="text-base font-medium text-gray-900 dark:text-dark-text">
            {prop.children}
        </span>
    );
};

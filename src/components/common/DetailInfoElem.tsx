// 電池詳細画面の電圧を表示するコンポーネント
// 編集モード時は入力フォームを表示し、非編集モード時はテキストを表示する

import React from 'react';
import { DetailInfoElemHead } from '@/components/common/DetailInfoElemHead';

interface DetailInfoElemProps {
  title: string;
  value: string | number;
  isEditing: boolean;
  children: React.ReactNode;
}

export function DetailInfoElem({ title, value, isEditing, children }: DetailInfoElemProps) {
  return (
    <div>
      <DetailInfoElemHead title={title} />
      <dd className="mt-1">
        {isEditing ? (
          children
        ) : (
          <div>
            <span className="text-sm text-gray-900 dark:text-dark-text">{value}</span>
          </div>
        )}
      </dd>
    </div>
  );
}

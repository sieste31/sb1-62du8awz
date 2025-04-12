// 電池詳細画面のタイトルを表示するコンポーネント

import React from 'react';

interface DetailInfoTitleProps {
    title: string;
    aria_label: string;
    placeholder: string;
    isEditing: boolean;
    setEditData: (data: { name: string }) => void;
}

export function DetailInfoTitle({title, aria_label, placeholder, isEditing, setEditData}: DetailInfoTitleProps) {
    if (isEditing)
    {
        return (
            <input
            type="text"
            value={title}
            onChange={(e) => setEditData({ name: e.target.value })}
            className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent w-full truncate"
            aria-label={aria_label}
            placeholder={placeholder}
            />);
    }
    else
    {
        return (
            <h2 className="text-xl font-bold text-gray-900 truncate">{title}</h2>
        );
    }
}

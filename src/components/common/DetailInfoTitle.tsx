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
    const text_base_class = "text-lg font-medium text-gray-900 dark:text-dark-text  w-full truncate";

    if (isEditing)
    {
        return (
            <input
            type="text"
            value={title}
            onChange={(e) => setEditData({ name: e.target.value })}
            className={"border-b-2 border-blue-500 focus:outline-none bg-transparent dark:text-gray-300" + text_base_class}
            aria-label={aria_label}
            placeholder={placeholder}
            />);
    }
    else
    {
        return (
            <h2 className={text_base_class}>{title}</h2>
        );
    }
}

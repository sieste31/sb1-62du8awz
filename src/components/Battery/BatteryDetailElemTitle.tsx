import React from 'react';

interface BatteryDetailElemTitleProps {
    isEditing: boolean;
    name: string;
    setName: (name: { name: string }) => void;
}

export function BatteryDetailElemTitle({ isEditing, name, setName }: BatteryDetailElemTitleProps){
    if (isEditing)
    {
        return (
            <input
            type="text"
            value={name}
            onChange={(e) => setName({name: e.target.value })}
            className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
            />);
    }
    else
    {
        return (
            <h2 className="text-xl font-bold text-gray-900">{name}</h2>
        );
    }
}
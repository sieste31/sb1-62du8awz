import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';

export function BatteryDetailElemTitle(){
    const isEditing = useBatteryDetailStore(state => state.isEditing);
    const editData = useBatteryDetailStore(state => state.editData);
    const setEditData = useBatteryDetailStore(state => state.setEditData);
    
    if (!editData) return null;
    if (isEditing)
    {
        return (
            <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ name: e.target.value })}
            className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
            />);
    }
    else
    {
        return (
            <h2 className="text-xl font-bold text-gray-900">{editData.name}</h2>
        );
    }
}

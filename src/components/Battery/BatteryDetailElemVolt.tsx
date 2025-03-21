import React from 'react';

interface BatteryDetailElemVoltProps {
  isEditing: boolean;
  editData: { voltage: number };
  setEditData: (data: { voltage: number }) => void;
  batteryGroup: { voltage: number };
}

export function BatteryDetailElemVolt({
  isEditing,
  editData,
  setEditData,
  batteryGroup,
}: BatteryDetailElemVoltProps) {
  if (isEditing) {
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500">電圧</dt>
        <dd className="mt-1">
          <input
            type="number"
            step="0.1"
            value={editData.voltage}
            onChange={(e) => setEditData({ voltage: parseFloat(e.target.value) })}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </dd>
      </div>
    );
  } else {
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500">電圧</dt>
        <dd className="mt-1">
          <span className="text-sm text-gray-900">{batteryGroup.voltage}V</span>
        </dd>
      </div>
    );
  }
}

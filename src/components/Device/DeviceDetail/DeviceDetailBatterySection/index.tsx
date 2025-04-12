// デバイス詳細画面の電池設定セクションを担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { DeviceBatterySlot } from './DeviceBatterySlot';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';
import { DeviceDetailBatterySectionHead } from './DeviceDetailBatterySectionHead';
import { Section } from '@/components/common/Section';

type Device = Database['public']['Tables']['devices']['Row'];
type Battery = Database['public']['Tables']['batteries']['Row'] & {
  battery_groups?: Database['public']['Tables']['battery_groups']['Row'];
};

interface DeviceDetailBatterySectionProps {
  device: Device;
  batteries: Battery[];
}

export function DeviceDetailBatterySection({ device, batteries }: DeviceDetailBatterySectionProps) {
  const { t } = useTranslation();
  const setShowHistory = useDeviceDetailStore(state => state.setShowHistory);

  return (
    <Section
      header={<DeviceDetailBatterySectionHead device={device} batteries={batteries} onClickShowHistory={() => setShowHistory(true)} />}
    >
      <div>
        {batteries.map((battery, index) => (
          <DeviceBatterySlot
            key={battery.id}
            slotNumber={index + 1}
            battery={battery}
          />
        ))}
        {Array.from({ length: device.battery_count - batteries.length }).map((_, index) => (
          <DeviceBatterySlot
            key={`empty-${index}`}
            slotNumber={batteries.length + index + 1}
          />
        ))}
      </div>
    </Section>
  );
}

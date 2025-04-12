// デバイス詳細画面の情報部分を表示するコンポーネント

import React, { useEffect } from 'react';
import { DeviceDetailElemHead } from './DeviceDetailElemHead';
import { DeviceDetailImage } from './DeviceDetailImage';
import { DeviceDetailElemType } from './DeviceDetailElemType';
import { DeviceDetailElemBatteryShape } from './DeviceDetailElemBatteryShape';
import { DeviceDetailElemBatteryCount } from './DeviceDetailElemBatteryCount';
import { DeviceDetailElemBatteryLife } from './DeviceDetailElemBatteryLife';
import { DeviceDetailElemPurchaseDate } from './DeviceDetailElemPurchaseDate';
import { DeviceDetailElemLastChange } from './DeviceDetailElemLastChange';
import { DeviceDetailElemNotes } from './DeviceDetailElemNotes';
import type { Database } from '@/lib/database.types';
import { Section } from '@/components/common/Section';

type Device = Database['public']['Tables']['devices']['Row'];
type Battery = Database['public']['Tables']['batteries']['Row'] & {
  battery_groups?: Database['public']['Tables']['battery_groups']['Row'];
};

interface DeviceDetailInfoProps {
  device: Device;
  batteries?: Battery[];
}

export function DeviceDetailInfo({ device, batteries = [] }: DeviceDetailInfoProps) {
  return (
    <Section
      header={<DeviceDetailElemHead device={device} />}>
      <div>
        <div className="flex flex-row space-x-4">
          <div className="flex-shrink-0">
            <DeviceDetailImage device={device} />
          </div>
          <div className="flex-1 min-w-0">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-3 sm:grid-cols-2">
              <DeviceDetailElemType device={device} />
              <DeviceDetailElemBatteryShape device={device} batteries={batteries} />
              <DeviceDetailElemBatteryCount device={device} batteries={batteries} />
              <DeviceDetailElemPurchaseDate device={device} />
              <DeviceDetailElemBatteryLife device={device} />
              <DeviceDetailElemLastChange device={device} batteries={batteries} />
            </dl>
          </div>
        </div>
        <div className="mt-6">
          <DeviceDetailElemNotes device={device} />
        </div>
      </div>
    </Section>
  );
}

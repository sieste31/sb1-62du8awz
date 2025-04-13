import React from 'react';
import { BatteryDetailInfoHead } from './BatteryDetailInfoHead';
import { BatteryDetailImage } from './BatteryDetailImage';
import { BatteryDetailElemShape } from './BatteryDetailElemShape';
import { BatteryDetailElemKind } from './BatteryDetailElemKind';
import { BatteryDetailElemCount } from './BatteryDetailElemCount';
import { BatteryDetailElemVolt } from './BatteryDetailElemVolt';
import { BatteryDetailElemMemo } from './BatteryDetailElemMemo';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { Section } from '@/components/common/Section';

interface BatteryDetailInfoSectionProps {
  // Define your props here
}

export function BatteryDetailInfoSection({ }: BatteryDetailInfoSectionProps) {
  // Zustandストアから状態と関数を取得
  const {
    setError,
    imageUrl,
    batteryGroup,
  } = useBatteryDetailStore();

  return (
    <Section
      header={<BatteryDetailInfoHead />}>
      <div>
        <div className="flex space-x-6">
          {batteryGroup && (
            <BatteryDetailImage
              imageUrl={imageUrl}
              batteryGroup={{
                id: batteryGroup.id,
                type: batteryGroup.type,
                image_url: batteryGroup.image_url,
              }}
              setError={setError}
            />
          )}
          <div className="flex-1">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-3 sm:grid-cols-2">
              <BatteryDetailElemShape />
              <BatteryDetailElemKind />
              <BatteryDetailElemCount />
              <BatteryDetailElemVolt />
            </dl>
          </div>
        </div>
        <div className="mt-6">
          <BatteryDetailElemMemo />
        </div>
      </div>
    </Section>
  );
};
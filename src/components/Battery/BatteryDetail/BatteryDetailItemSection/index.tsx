import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { BatteryDetailItem } from './BatteryDetailItem';
import { useTranslation } from 'react-i18next';
import { Section } from '@/components/common/Section';

interface BatteryDetailItemSectionProps {
    // Define your props here
}

export function BatteryDetailItemSection({ }: BatteryDetailItemSectionProps) {
    const { t } = useTranslation();
    // Zustandストアから状態と関数を取得
    const {
        setError,
        batteryGroup, batteries,
    } = useBatteryDetailStore();

    // 電池をslot_numberで昇順にソート
    const sortedBatteries = batteries ? [...batteries].sort((a, b) => a.slot_number - b.slot_number) : [];

    return (
        <Section header={
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text">{t('battery.list.individualSettings')}</h3>
        }>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {sortedBatteries.map((battery) => (
                    batteryGroup && (
                        <BatteryDetailItem
                            key={battery.slot_number}
                            battery={battery}
                            batteryGroup={batteryGroup}
                            setError={setError}
                        />
                    )
                ))}
            </div>
        </Section>
    );
};
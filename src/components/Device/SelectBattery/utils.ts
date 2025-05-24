import { BatteryStatus, BatteryKind } from './types';

export function getBatteryStatusLabel(status: BatteryStatus, t: (key: string) => string): string {
    switch (status) {
        case 'charged': return t('battery.status.charged');
        case 'in_use': return t('battery.status.in_use');
        case 'empty': return t('battery.status.empty');
        case 'disposed': return t('battery.status.disposed');
        default: return t('battery.status.unknown');
    }
}

export function getBatteryKindLabel(kind: BatteryKind, t: (key: string) => string): string {
    switch (kind) {
        case 'all': return t('common.all');
        case 'disposable': return t('battery.kind.disposable');
        case 'rechargeable': return t('battery.kind.rechargeable');
        default: return kind;
    }
}

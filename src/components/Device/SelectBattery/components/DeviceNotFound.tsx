import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function DeviceNotFound({
    navigate
}: {
    navigate: (path: string) => void
}) {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-xl text-gray-600">{t('device.select.deviceNotFound')}</p>
                <button
                    onClick={() => navigate('/devices')}
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('device.detail.backToList')}
                </button>
            </div>
        </div>
    );
}


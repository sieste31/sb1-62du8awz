import React from 'react';
import { useTranslation } from 'react-i18next';

const LandingFeatures: React.FC = () => {
    const { t } = useTranslation();

    const getDetailsArray = (key: string): string[] => {
        const details = t(key);
        // 文字列の場合は配列に変換
        if (typeof details === 'string') {
            return [details];
        }
        // 配列の場合はそのまま返す
        if (Array.isArray(details)) {
            return details;
        }
        // それ以外の場合（オブジェクトなど）は空配列を返す
        return [];
    };

    const features = [
        {
            title: t('landingPage.features.notification.title'),
            description: t('landingPage.features.notification.description'),
            details: getDetailsArray('landingPage.features.notification.details'),
            icon: '🔔'
        },
        {
            title: t('landingPage.features.inventory.title'),
            description: t('landingPage.features.inventory.description'),
            details: getDetailsArray('landingPage.features.inventory.details'),
            icon: '📦'
        },
        {
            title: t('landingPage.features.deviceTracking.title'),
            description: t('landingPage.features.deviceTracking.description'),
            details: getDetailsArray('landingPage.features.deviceTracking.details'),
            icon: '🔋'
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    {t('landingPage.features.title')}
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="text-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition duration-300 group"
                        >
                            <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {feature.description}
                            </p>
                            <ul className="text-left text-gray-500 space-y-2 pl-5 list-disc">
                                {feature.details.map((detail: string, detailIndex: number) => (
                                    <li key={detailIndex}>{detail}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LandingFeatures;

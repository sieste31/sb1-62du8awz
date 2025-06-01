import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { setLanguageFromPath } from '../lib/i18nUtils';

const TermsOfService: React.FC = () => {
    useEffect(() => {
        setLanguageFromPath();
    }, []);

    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="container mx-auto px-4 py-16 flex-grow">
                <Helmet>
                    <title>{t('termsOfService.pageTitle')}</title>
                </Helmet>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">{t('termsOfService.title')}</h1>

                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('termsOfService.serviceUsage.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('termsOfService.serviceUsage.description')}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('termsOfService.userResponsibilities.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('termsOfService.userResponsibilities.description')}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('termsOfService.prohibitedActions.title')}</h2>
                        <ul className="text-gray-600 leading-relaxed list-disc pl-5">
                            {(t('termsOfService.prohibitedActions.list', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('termsOfService.intellectualProperty.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('termsOfService.intellectualProperty.description')}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('termsOfService.disclaimer.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('termsOfService.disclaimer.description')}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('termsOfService.serviceModification.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('termsOfService.serviceModification.description')}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('termsOfService.changes.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('termsOfService.changes.description')}</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;

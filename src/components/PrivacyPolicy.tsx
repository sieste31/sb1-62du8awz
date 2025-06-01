import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="container mx-auto px-4 py-16 flex-grow">
                <Helmet>
                    <title>{t('privacyPolicy.pageTitle')}</title>
                </Helmet>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">{t('privacyPolicy.title')}</h1>

                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('privacyPolicy.emailCollection.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('privacyPolicy.emailCollection.description')}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('privacyPolicy.emailUsage.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('privacyPolicy.emailUsage.description')}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('privacyPolicy.dataHandling.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('privacyPolicy.dataHandling.description')}</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('privacyPolicy.contact.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('privacyPolicy.contact.description')}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('privacyPolicy.changes.title')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('privacyPolicy.changes.description')}</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

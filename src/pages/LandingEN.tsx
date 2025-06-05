import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { generateLandingPageSEO, renderSEOMetaTags } from '../lib/seoUtils';
import LandingHeader from '../components/LandingHeader';
import LandingFeatures from '../components/LandingFeatures';
import LandingPlanInfo from '../components/LandingPlanInfo';
import LandingFooter from '../components/LandingFooter';
import LandingUseCases from '../components/LandingUseCases';

const LandingPageEN: React.FC = () => {
    const { t } = useTranslation();
    const seo = generateLandingPageSEO(t, 'en');
    const seoTags = renderSEOMetaTags(seo);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Helmet>
                <title>{seoTags.title}</title>
                {seoTags.meta.map((tag, index) => (
                    <meta key={index} {...tag} />
                ))}
            </Helmet>
            <LandingHeader />

            <main className="flex-grow container mx-auto px-4 py-16">
                <section className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {t('landingPage.hero.title')}
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        {t('landingPage.hero.subtitle')}
                    </p>
                </section>
                <LandingUseCases />
                <LandingFeatures />

                <section className="bg-white dark:bg-dark-card shadow-lg rounded-xl p-6 mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                            {t('landingPage.demo.title')}
                        </h2>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('landingPage.demo.description')}
                        </p>
                        <Link
                            to="/en/demo"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {t('landingPage.demo.title')}
                        </Link>
                    </div>
                </section>

                <LandingPlanInfo />
            </main>

            <LandingFooter />
        </div>
    );
};

export default LandingPageEN;

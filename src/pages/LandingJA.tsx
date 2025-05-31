import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { generateLandingPageSEO, renderSEOMetaTags } from '../lib/seoUtils';
import LandingHeader from '../components/LandingHeader';
import LandingFeatures from '../components/LandingFeatures';
import LandingPlanInfo from '../components/LandingPlanInfo';
import LandingFooter from '../components/LandingFooter';

const LandingPageJA: React.FC = () => {
    const { t } = useTranslation();
    const seo = generateLandingPageSEO(t, 'ja');
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

                    <div className="flex justify-center items-center space-x-4">
                        <a
                            href="/signup"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            {t('landingPage.cta.signup')}
                        </a>
                        <a
                            href="/login"
                            className="text-blue-600 hover:text-blue-800 transition duration-300"
                        >
                            {t('landingPage.hero.existingUser')}
                        </a>
                    </div>
                </section>

                <LandingFeatures />
                <LandingPlanInfo />
            </main>

            <LandingFooter />
        </div>
    );
};

export default LandingPageJA;

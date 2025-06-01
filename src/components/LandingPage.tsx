import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LandingHeader from './LandingHeader';
import LandingFeatures from './LandingFeatures';
import LandingPlanInfo from './LandingPlanInfo';
import LandingFooter from './LandingFooter';
import LandingUseCases from './LandingUseCases';

const LandingPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
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
                <LandingPlanInfo />
            </main>

            <LandingFooter />
        </div>
    );
};

export default LandingPage;

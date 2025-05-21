import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LandingHeader from './LandingHeader';
import LandingFeatures from './LandingFeatures';
import LandingPlanInfo from './LandingPlanInfo';
import LandingFooter from './LandingFooter';

const LandingPage: React.FC = () => {
    const { t } = useTranslation();

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

                    <div className="flex justify-center items-center space-x-4">
                        <Link
                            to="/signup"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            {t('landingPage.cta.signup')}
                        </Link>
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-800 transition duration-300"
                        >
                            {t('landingPage.hero.existingUser')}
                        </Link>
                    </div>
                </section>

                <LandingFeatures />
                <LandingPlanInfo />
            </main>

            <LandingFooter />
        </div>
    );
};

export default LandingPage;

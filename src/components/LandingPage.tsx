import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LandingHeader from './LandingHeader';
import LandingFeatures from './LandingFeatures';
import LandingPlanInfo from './LandingPlanInfo';
import LandingFooter from './LandingFooter';
import LandingUseCases from './LandingUseCases';

interface LandingPageProps {
    onGoogleSignIn?: () => void;
    onDemoLogin?: () => void;
    language?: 'ja' | 'en';
}

const LandingPage: React.FC<LandingPageProps> = ({
    onGoogleSignIn,
    onDemoLogin,
    language = 'ja'
}) => {
    const { t, i18n } = useTranslation();

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

                    {/* ログインボタンエリア */}
                    <div className="flex justify-center space-x-4 mb-8">
                        {onGoogleSignIn && (
                            <button
                                onClick={onGoogleSignIn}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            >
                                {t('landingPage.login.google')}
                            </button>
                        )}

                        {onDemoLogin && (
                            <button
                                onClick={onDemoLogin}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                            >
                                {t('landingPage.login.demo')}
                            </button>
                        )}
                    </div>
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

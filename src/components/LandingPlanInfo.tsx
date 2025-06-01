import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const LandingPlanInfo: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    {t('landingPage.planInfo.title')}
                </h2>

                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-xl text-gray-600 mb-8">
                        {t('landingPage.planInfo.description')}
                    </p>

                    <div className="flex justify-center items-center space-x-4">
                        <Link
                            to={'/signup'}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            {t('landingPage.cta.signup')}
                        </Link>
                        <Link
                            to={'/login'}
                            className="text-blue-600 hover:text-blue-800 transition duration-300"
                        >
                            {t('landingPage.hero.existingUser')}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingPlanInfo;

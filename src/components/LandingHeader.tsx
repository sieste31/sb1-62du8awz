import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

const LandingHeader: React.FC = () => {
    const { t } = useTranslation();

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/" className="text-2xl font-bold text-gray-800">
                        {t('app.title')}
                    </Link>
                </div>

                <nav className="flex items-center space-x-4">
                    <LanguageSwitcher />
                    <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-800 transition duration-300"
                    >
                        {t('landingPage.cta.login')}
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default LandingHeader;

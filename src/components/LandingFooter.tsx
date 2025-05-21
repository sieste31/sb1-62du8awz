import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LandingFooter: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-gray-100 py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            {t('app.title')}
                        </h3>
                        <p className="text-gray-600">
                            {t('landingPage.hero.subtitle')}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-4">
                            {t('landingPage.footer.contact')}
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="mailto:support@batterymanagement.com"
                                    className="text-gray-600 hover:text-blue-600 transition duration-300"
                                >
                                    メールでのお問い合わせ
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-4">
                            リーガル
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/privacy"
                                    className="text-gray-600 hover:text-blue-600 transition duration-300"
                                >
                                    {t('landingPage.footer.privacyPolicy')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terms"
                                    className="text-gray-600 hover:text-blue-600 transition duration-300"
                                >
                                    {t('landingPage.footer.termsOfService')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-4">
                            サポート
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/faq"
                                    className="text-gray-600 hover:text-blue-600 transition duration-300"
                                >
                                    {t('landingPage.footer.faq')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 text-center text-gray-500 text-sm">
                    {t('landingPage.footer.copyright')}
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;

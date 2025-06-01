import React from 'react';
import { useTranslation } from 'react-i18next';

interface UseCaseItem {
    id: string;
    problem: {
        title: string;
        icon: string;
        scenarios: string[];
    };
    solution: {
        title: string;
        icon: string;
        description: string;
        features: string[];
    };
}

const LandingUseCases: React.FC = () => {
    const { t } = useTranslation();

    const useCases = t('landingPage.useCases.cases', { returnObjects: true }) as UseCaseItem[];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                    {t('landingPage.useCases.title')}
                </h2>
                <p className="text-xl text-center text-gray-600 mb-12">
                    {t('landingPage.useCases.subtitle')}
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                    {useCases.map((useCase) => (
                        <div
                            key={useCase.id}
                            className="bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition duration-300 p-6 group"
                        >
                            <div className="text-5xl mb-4 text-center group-hover:scale-110 transition duration-300">
                                {useCase.problem.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                                {useCase.problem.title}
                            </h3>
                            <div className="mb-4">
                                <h4 className="font-bold text-gray-700 mb-2">シナリオ:</h4>
                                <ul className="text-gray-600 space-y-2 pl-5 list-disc">
                                    {useCase.problem.scenarios.map((scenario, scenarioIndex) => (
                                        <li key={scenarioIndex}>{scenario}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-3xl mb-2 text-center">
                                    {useCase.solution.icon}
                                </div>
                                <h4 className="text-lg font-semibold text-green-800 text-center mb-2">
                                    {useCase.solution.title}
                                </h4>
                                <p className="text-green-700 text-center mb-3">
                                    {useCase.solution.description}
                                </p>
                                <ul className="text-green-600 space-y-2 pl-5 list-disc">
                                    {useCase.solution.features.map((feature, featureIndex) => (
                                        <li key={featureIndex}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LandingUseCases;

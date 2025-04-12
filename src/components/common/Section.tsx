import React from 'react';

interface SectionProps {
    header: React.ReactNode;
    children: React.ReactNode;
}

export function Section({ header, children }: SectionProps) {
    return (
        <div className="bg-white dark:bg-dark-card shadow rounded-lg overflow-hidden mb-6">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-dark-border">
                {header}
            </div>
            <div className="px-4 py-4 sm:px-6 border-b border-gray-200 dark:border-dark-border">
                {children}
            </div>
        </div>
    );
};

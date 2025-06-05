import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-provider';
import { DEMO_USER_ID } from '@/lib/demo';
import { DemoModeProvider } from '@/components/Demo/DemoModeContext';
import { BatteryList } from '@/components/Battery/BatteryList';
import { DeviceList } from '@/components/Device/DeviceList';
import { Navigation } from '@/components/Navigation';

export function DemoEN() {
    const { user } = useAuth();

    // Redirect to landing page if not demo user
    if (!user || user.id !== DEMO_USER_ID) {
        return <Navigate to="/en" replace />;
    }

    return (
        <DemoModeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
                <Navigation isDemoMode={true} />

                <main className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Demo Mode
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            This is a read-only demo mode. You cannot edit or delete data.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                Battery Groups
                            </h2>
                            <BatteryList isDemoMode={true} />
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                Devices
                            </h2>
                            <DeviceList isDemoMode={true} />
                        </section>
                    </div>
                </main>
            </div>
        </DemoModeProvider>
    );
}

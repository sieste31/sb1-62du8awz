import React, { createContext, useContext } from 'react';
import { demoBatteryGroups, demoDevices, demoBatteries } from '@/data/demoData';

type DemoModeContextType = {
    batteryGroups: typeof demoBatteryGroups;
    devices: typeof demoDevices;
    batteries: typeof demoBatteries;
    isDemo: boolean;
};

const DemoModeContext = createContext<DemoModeContextType>({
    batteryGroups: [],
    devices: [],
    batteries: [],
    isDemo: false
});

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const demoContextValue = {
        batteryGroups: demoBatteryGroups,
        devices: demoDevices,
        batteries: demoBatteries,
        isDemo: true
    };

    return (
        <DemoModeContext.Provider value={demoContextValue}>
            {children}
        </DemoModeContext.Provider>
    );
};

export const useDemoMode = () => {
    const context = useContext(DemoModeContext);
    if (!context) {
        throw new Error('useDemoMode must be used within a DemoModeProvider');
    }
    return context;
};

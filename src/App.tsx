import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navigation } from './components/Navigation';
import { Breadcrumbs } from './components/Breadcrumbs';
import { BatteryList } from './components/Battery/BatteryList';
import { BatteryDetail } from './components/Battery/BatteryDetail';
import { BatteryForm } from './components/Battery/BatteryForm';
import { DeviceList } from './components/Device/DeviceList';
import { DeviceDetail } from './components/Device/DeviceDetail';
import { DeviceForm } from './components/Device/DeviceForm';
import { SelectBattery } from './components/Device/SelectBattery/index';
import { UserSettings } from './components/UserSettings';
import { Login } from './components/Login';
import { AuthRequired } from './components/AuthRequired';
import { useAuth } from './lib/auth-provider';
import { useDarkMode } from './lib/hooks';
import LandingPageJA from './pages/LandingJA';
import LandingPageEN from './pages/LandingEN';

function App() {
  const { user, loading } = useAuth();
  const { isDark } = useDarkMode();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
          {user && <Navigation />}
          <main className={user ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" : ""}>
            {user && <Breadcrumbs />}
            <Routes>
              {/* ランディングページのルーティング */}
              <Route path="/" element={user ? <Navigate to="/app/batteries" replace /> : <LandingPageJA />} />
              <Route path="/ja" element={user ? <Navigate to="/app/batteries" replace /> : <LandingPageJA />} />
              <Route path="/en" element={user ? <Navigate to="/app/batteries" replace /> : <LandingPageEN />} />

              {/* 認証ページ */}
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/app/batteries" replace />} />
              <Route path="/signup" element={!user ? <Login isSignUp /> : <Navigate to="/app/batteries" replace />} />

              {/* アプリケーションルート */}
              <Route path="/app" element={<AuthRequired />}>
                <Route path="batteries" element={<BatteryList />} />
                <Route path="batteries/new" element={<BatteryForm />} />
                <Route path="batteries/:id" element={<BatteryDetail />} />
                <Route path="devices" element={<DeviceList />} />
                <Route path="devices/new" element={<DeviceForm />} />
                <Route path="devices/:id" element={<DeviceDetail />} />
                <Route path="devices/:deviceId/select-battery" element={<SelectBattery />} />
                <Route path="settings" element={<UserSettings />} />
              </Route>

              {/* その他のルート */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

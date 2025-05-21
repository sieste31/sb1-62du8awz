import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Breadcrumbs } from './components/Breadcrumbs';
import { BatteryList } from './components/Battery/BatteryList';
import { BatteryDetail } from './components/Battery/BatteryDetail';
import { BatteryForm } from './components/Battery/BatteryForm';
import { DeviceList } from './components/Device/DeviceList';
import { DeviceDetail } from './components/Device/DeviceDetail';
import { DeviceForm } from './components/Device/DeviceForm';
import { SelectBattery } from './components/Device/SelectBattery';
import { UserSettings } from './components/UserSettings';
import { Login } from './components/Login';
import { AuthRequired } from './components/AuthRequired';
import { useAuth } from './lib/auth-provider';
import { useDarkMode } from './lib/hooks';
import LandingPage from './components/LandingPage';

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
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        {user && <Navigation />}
        <main className={user ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" : ""}>
          {user && <Breadcrumbs />}
          <Routes>
            <Route path="/" element={user ? <Navigate to="/batteries" replace /> : <LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/batteries"
              element={
                <AuthRequired>
                  <BatteryList />
                </AuthRequired>
              }
            />
            <Route
              path="/batteries/new"
              element={
                <AuthRequired>
                  <BatteryForm />
                </AuthRequired>
              }
            />
            <Route
              path="/batteries/:id"
              element={
                <AuthRequired>
                  <BatteryDetail />
                </AuthRequired>
              }
            />
            <Route
              path="/devices"
              element={
                <AuthRequired>
                  <DeviceList />
                </AuthRequired>
              }
            />
            <Route
              path="/devices/new"
              element={
                <AuthRequired>
                  <DeviceForm />
                </AuthRequired>
              }
            />
            <Route
              path="/devices/:id"
              element={
                <AuthRequired>
                  <DeviceDetail />
                </AuthRequired>
              }
            />
            <Route
              path="/devices/:deviceId/select-battery"
              element={
                <AuthRequired>
                  <SelectBattery />
                </AuthRequired>
              }
            />
            <Route
              path="/settings"
              element={
                <AuthRequired>
                  <UserSettings />
                </AuthRequired>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

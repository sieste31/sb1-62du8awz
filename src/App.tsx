import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Breadcrumbs } from './components/Breadcrumbs';
import { BatteryList } from './components/BatteryList';
import { BatteryDetail } from './components/BatteryDetail';
import { BatteryForm } from './components/BatteryForm';
import { DeviceList } from './components/DeviceList';
import { DeviceDetail } from './components/DeviceDetail';
import { DeviceForm } from './components/DeviceForm';
import { SelectBattery } from './components/SelectBattery';
import { Login } from './components/Login';
import { AuthRequired } from './components/AuthRequired';
import { useAuth } from './lib/auth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {user && <Navigation />}
        <main className={user ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" : ""}>
          {user && <Breadcrumbs />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <AuthRequired>
                  <Navigate to="/batteries" replace />
                </AuthRequired>
              }
            />
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
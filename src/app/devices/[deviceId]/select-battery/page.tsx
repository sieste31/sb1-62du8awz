'use client';

import { SelectBattery } from '@/components/Device/SelectBattery';
import { Navigation } from '@/components/Navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AuthRequired } from '@/components/AuthRequired';

export default function SelectBatteryPage({ params }: { params: { deviceId: string } }) {
  return (
    <AuthRequired>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs />
          <SelectBattery deviceId={params.deviceId} />
        </main>
      </div>
    </AuthRequired>
  );
}
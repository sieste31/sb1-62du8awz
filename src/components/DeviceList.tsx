'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Speaker, Camera, Gamepad, Lightbulb, Plus, ToyBrick } from 'lucide-react';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';
import { useDevices } from '@/lib/hooks';
import { getDeviceImage } from '@/lib/deviceImages';
import type { Database } from '@/lib/database.types';

type Device = Database['public']['Tables']['devices']['Row'];

const iconMap = {
  smartphone: Smartphone,
  speaker: Speaker,
  camera: Camera,
  gadget: Gamepad,
  light: Lightbulb,
  toy: ToyBrick,
};

interface DeviceItemProps {
  device: Device;
}

function DeviceItem({ device }: DeviceItemProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const Icon = iconMap[device.type as keyof typeof iconMap];
  const shortId = device.id.slice(0, 8);

  useEffect(() => {
    getDeviceImage(device.type as keyof typeof iconMap, device.image_url)
      .then(url => setImageUrl(url));
  }, [device.type, device.image_url]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex flex-col">
          <Link href={`/devices/${device.id}`} className="flex-1">
            <div className="flex items-start space-x-4">
              <img
                src={imageUrl || ''}
                alt={device.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center">
                  <Icon className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-lg font-medium text-gray-900">{device.name}</p>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {device.battery_type} × {device.battery_count}本
                  </span>
                  <span className="text-xs text-gray-400 font-mono">#{shortId}</span>
                </div>
                {device.notes && (
                  <p className="mt-2 text-sm text-gray-500 truncate">{device.notes}</p>
                )}
                {device.purchase_date && (
                  <p className="mt-1 text-sm text-gray-500">
                    購入日: {new Date(device.purchase_date).toLocaleDateString()}
                  </p>
                )}
                {device.last_battery_change && (
                  <p className="mt-1 text-sm text-gray-500">
                    交換日: {new Date(device.last_battery_change).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function DeviceList() {
  const { devices, loading } = useDevices();
  const isDesktop = useMediaQuery({ minWidth: 768 });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">デバイス一覧</h2>
        <Link
          href="/devices/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          新規登録
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        {devices.length === 0 ? (
          <div className="text-center py-12">
            <Smartphone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">デバイスがありません</h3>
            <p className="mt-1 text-sm text-gray-500">新しいデバイスを登録してください。</p>
            <div className="mt-6">
              <Link
                href="/devices/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規登録
              </Link>
            </div>
          </div>
        ) : (
          <div className={`p-4 grid gap-4 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {devices.map((device) => (
              <DeviceItem key={device.id} device={device} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
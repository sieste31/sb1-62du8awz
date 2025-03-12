'use client';

import React, { useEffect, useState } from 'react';
import { Battery, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { getBatteryImage } from '@/lib/batteryImages';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
  batteries?: (Database['public']['Tables']['batteries']['Row'] & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
  })[];
};

interface BatteryListItemProps {
  group: BatteryGroup;
}

export function BatteryListItem({ group }: BatteryListItemProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [installedCount, setInstalledCount] = useState(0);
  const totalCount = group.count;
  const shortId = group.id.slice(0, 8);

  useEffect(() => {
    getBatteryImage(group.type as keyof typeof defaultBatteryImages, group.image_url)
      .then(url => setImageUrl(url));
    
    // Fetch the actual installed count from the database
    async function fetchInstalledCount() {
      try {
        const { data, error } = await supabase
          .from('batteries')
          .select('id')
          .eq('group_id', group.id)
          .not('device_id', 'is', null);
        
        if (error) throw error;
        setInstalledCount(data?.length || 0);
      } catch (err) {
        console.error('Error fetching installed batteries count:', err);
      }
    }
    
    fetchInstalledCount();
  }, [group.type, group.image_url, group.id]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex">
          <Link href={`/batteries/${group.id}`} className="flex-shrink-0">
            <img
              src={imageUrl || ''}
              alt={`${group.type}の画像`}
              className="w-24 h-24 rounded-lg object-cover"
            />
          </Link>
          <div className="ml-4 flex-1 min-w-0">
            <Link 
              href={`/batteries/${group.id}`}
              className="block text-xl font-medium text-gray-900 hover:text-gray-700 mb-2"
            >
              {group.name}
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-500">{group.type}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                group.kind === 'rechargeable' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {group.kind === 'rechargeable' ? '充電池' : '使い切り'}
              </span>
              <span className="text-xs text-gray-400 font-mono">#{shortId}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              <span>登録日: {new Date(group.created_at).toLocaleDateString()}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              <span className="whitespace-nowrap">総: {totalCount}本</span>
              <span className="whitespace-nowrap">設置済: {installedCount}本</span>
              <span className="whitespace-nowrap">未設置: {totalCount - installedCount}本</span>
            </div>
            {group.notes && (
              <p className="mt-2 text-sm text-gray-500 truncate">{group.notes}</p>
            )}
            {group.batteries?.some(b => b.device_id && b.devices) && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">設置中のデバイス:</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {group.batteries
                    .filter(b => b.device_id && b.devices)
                    .map(b => (
                      <Link
                        key={b.id}
                        href={`/devices/${b.devices?.id}`}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700 hover:bg-gray-200"
                      >
                        {b.devices?.name}
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
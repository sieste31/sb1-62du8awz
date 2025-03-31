// デバイス作成画面のコンポーネント

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Speaker, Camera, Lightbulb, Gamepad, ArrowLeft, ToyBrick, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-provider';
import { useDevices, useUserPlan } from '@/lib/hooks';
import type { Database } from '@/lib/database.types';

type DeviceType = Database['public']['Tables']['devices']['Row']['type'];

const deviceTypeOptions = [
  { value: 'smartphone', label: 'スマートフォン/リモコン', icon: Smartphone },
  { value: 'speaker', label: 'スピーカー', icon: Speaker },
  { value: 'camera', label: 'カメラ', icon: Camera },
  { value: 'gadget', label: 'ガジェット', icon: Gamepad },
  { value: 'light', label: 'ライト', icon: Lightbulb },
  { value: 'toy', label: 'おもちゃ', icon: ToyBrick },
];

export function DeviceForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { devices } = useDevices();
  const { userPlan, isLimitReached } = useUserPlan();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  
  // 制限チェック
  const isDeviceLimitReached = isLimitReached.devices(devices.length);
  
  useEffect(() => {
    // ページ読み込み時に制限チェック
    if (isDeviceLimitReached) {
      setShowLimitWarning(true);
    }
  }, [isDeviceLimitReached]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'smartphone' as DeviceType,
    batteryShape: '単3形',
    batteryCount: 1,
    batteryLifeWeeks: '' as string | number,
    purchaseDate: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // 制限チェック
    if (isDeviceLimitReached) {
      setError('デバイスの上限に達しています。プランをアップグレードしてください。');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('devices')
        .insert({
          name: formData.name,
          type: formData.type,
          battery_type: formData.batteryShape,
          battery_count: formData.batteryCount,
          battery_life_weeks: formData.batteryLifeWeeks ? Number(formData.batteryLifeWeeks) : null,
          purchase_date: formData.purchaseDate || null,
          notes: formData.notes || null,
          user_id: user.id,
        });

      if (insertError) throw insertError;

      navigate('/devices');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'デバイスの登録に失敗しました');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/devices')}
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">デバイスの新規登録</h2>
          </div>
          
          {showLimitWarning && (
            <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700">
                    デバイスの上限に達しています（{devices.length}/{userPlan?.max_devices || 5}）。
                    <button 
                      className="ml-2 font-medium text-amber-700 underline"
                      onClick={() => alert('この機能は現在開発中です。')}
                    >
                      プランをアップグレード
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                デバイス名
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                デバイスタイプ
              </label>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {deviceTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                        formData.type === option.value
                          ? 'border-blue-500 ring-2 ring-blue-500'
                          : 'border-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, type: option.value as DeviceType })}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <Icon className="h-5 w-5 text-gray-400 mr-2" />
                            <p className="font-medium text-gray-900">{option.label}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="batteryShape" className="block text-sm font-medium text-gray-700">
                  電池形状
                </label>
                <select
                  id="batteryShape"
                  value={formData.batteryShape}
                  onChange={(e) => setFormData({ ...formData, batteryShape: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="単1形">単1形</option>
                  <option value="単2形">単2形</option>
                  <option value="単3形">単3形</option>
                  <option value="単4形">単4形</option>
                  <option value="9V形">9V形</option>
                </select>
              </div>

              <div>
                <label htmlFor="batteryCount" className="block text-sm font-medium text-gray-700">
                  必要本数
                </label>
                <input
                  type="number"
                  id="batteryCount"
                  min="1"
                  required
                  value={formData.batteryCount}
                  onChange={(e) => setFormData({ ...formData, batteryCount: parseInt(e.target.value) })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="batteryLifeWeeks" className="block text-sm font-medium text-gray-700">
                電池寿命（週）
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="batteryLifeWeeks"
                  min="1"
                  value={formData.batteryLifeWeeks}
                  onChange={(e) => setFormData({ ...formData, batteryLifeWeeks: e.target.value })}
                  placeholder="例: 12"
                  className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">週</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                電池の予想寿命を週単位で設定します。空欄の場合は通知されません。
              </p>
            </div>

            <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
                購入日
              </label>
              <input
                type="date"
                id="purchaseDate"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                メモ
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? '登録中...' : '登録する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

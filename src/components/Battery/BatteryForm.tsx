// 電池作成画面のコンポーネント

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Battery, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-provider';

type BatteryKind = 'disposable' | 'rechargeable';
type BatteryStatus = 'charged' | 'empty';

export function BatteryForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '単3形',
    kind: 'disposable' as BatteryKind,
    status: 'charged' as BatteryStatus,
    count: 1,
    voltage: 1.5,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // 1. 電池グループを作成
      const { data: groupData, error: groupError } = await supabase
        .from('battery_groups')
        .insert({
          name: formData.name,
          type: formData.type,
          kind: formData.kind,
          count: formData.count,
          voltage: formData.voltage,
          notes: formData.notes || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // 2. 個々の電池を作成
      const batteries = Array.from({ length: formData.count }, () => ({
        group_id: groupData.id,
        status: formData.kind === 'disposable' ? 'empty' : formData.status,
        user_id: user.id,
      }));

      const { error: batteriesError } = await supabase
        .from('batteries')
        .insert(batteries);

      if (batteriesError) throw batteriesError;

      navigate('/batteries');
    } catch (err) {
      setError(err instanceof Error ? err.message : '電池の登録に失敗しました');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/batteries')}
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <div className="flex items-center">
              <Battery className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">電池グループの新規登録</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                グループ名
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="例: リモコン用単3電池"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                電池種別
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700">
                電池タイプ
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    formData.kind === 'disposable'
                      ? 'border-blue-500 ring-2 ring-blue-500'
                      : 'border-gray-300'
                  }`}
                  onClick ={() => {
                    setFormData({ 
                      ...formData, 
                      kind: 'disposable',
                      status: 'empty'
                    });
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">使い切り</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    formData.kind === 'rechargeable'
                      ? 'border-blue-500 ring-2 ring-blue-500'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, kind: 'rechargeable' })}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">充電池</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                電池の状態
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div
                  className={`relative flex rounded-lg border p-4 ${
                    formData.status === 'charged'
                      ? 'border-blue-500 ring-2 ring-blue-500'
                      : 'border-gray-300'
                  } ${
                    formData.kind === 'disposable'
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  onClick={() => {
                    if (formData.kind === 'rechargeable') {
                      setFormData({ ...formData, status: 'charged' });
                    }
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">充電済み</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    formData.status === 'empty'
                      ? 'border-blue-500 ring-2 ring-blue-500'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, status: 'empty' })}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">空</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="count" className="block text-sm font-medium text-gray-700">
                本数
              </label>
              <input
                type="number"
                id="count"
                min="1"
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="voltage" className="block text-sm font-medium text-gray-700">
                電圧 (V)
              </label>
              <input
                type="number"
                id="voltage"
                step="0.1"
                min="0"
                value={formData.voltage}
                onChange={(e) => setFormData({ ...formData, voltage: parseFloat(e.target.value) })}
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

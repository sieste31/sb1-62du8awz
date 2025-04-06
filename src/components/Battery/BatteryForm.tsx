// 電池作成画面のコンポーネント

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Battery, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { useBatteryGroups, useUserPlan } from '@/lib/hooks';
import { createBatteryGroupWithBatteries } from '@/lib/api';
import { useTranslation } from 'react-i18next';

type BatteryKind = 'disposable' | 'rechargeable';
type BatteryStatus = 'charged' | 'empty';

export function BatteryForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { batteryGroups } = useBatteryGroups();
  const { userPlan, isLimitReached } = useUserPlan();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  
  // 制限チェック
  const isBatteryGroupLimitReached = isLimitReached.batteryGroups(batteryGroups.length);
  
  useEffect(() => {
    // ページ読み込み時に制限チェック
    if (isBatteryGroupLimitReached) {
      setShowLimitWarning(true);
    }
  }, [isBatteryGroupLimitReached]);
  const [formData, setFormData] = useState({
    name: '',
    shape: '単3形',
    kind: 'disposable' as BatteryKind,
    status: 'charged' as BatteryStatus,
    count: 1,
    voltage: 1.5,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // 制限チェック
    if (isBatteryGroupLimitReached) {
      setError(t('battery.form.limitReachedError'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 電池グループと電池を一括で作成
      await createBatteryGroupWithBatteries(
        {
          name: formData.name,
          shape: formData.shape,
          kind: formData.kind,
          count: formData.count,
          voltage: formData.voltage,
          notes: formData.notes || null,
          user_id: user.id,
        },
        formData.count,
        formData.status,
        user.id
      );

      navigate('/batteries');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('battery.form.createError'));
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
            {t('battery.list.backToList')}
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <div className="flex items-center">
              <Battery className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">{t('battery.form.title')}</h2>
            </div>
          </div>
          
          {showLimitWarning && (
            <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700">
                    {t('battery.form.limitReachedWarning', { current: batteryGroups.length, max: userPlan?.max_battery_groups || 5 })}
                    <button 
                      className="ml-2 font-medium text-amber-700 underline"
                      onClick={() => alert(t('battery.form.upgradeInDevelopment'))}
                    >
                      {t('battery.form.upgradePlan')}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t('battery.form.nameLabel')}
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('battery.form.namePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="shape" className="block text-sm font-medium text-gray-700">
                {t('battery.detail.shape')}
              </label>
              <select
                id="shape"
                value={formData.shape}
                onChange={(e) => setFormData({ ...formData, shape: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="単1形">{t('battery.shape.d')}</option>
                <option value="単2形">{t('battery.shape.c')}</option>
                <option value="単3形">{t('battery.shape.aa')}</option>
                <option value="単4形">{t('battery.shape.aaa')}</option>
                <option value="9V形">{t('battery.shape.9v')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('battery.detail.kind')}
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
                        <p className="font-medium text-gray-900">{t('battery.kind.disposable')}</p>
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
                        <p className="font-medium text-gray-900">{t('battery.kind.rechargeable')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('battery.form.statusLabel')}
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
                        <p className="font-medium text-gray-900">{t('battery.status.charged')}</p>
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
                        <p className="font-medium text-gray-900">{t('battery.status.empty')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="count" className="block text-sm font-medium text-gray-700">
                {t('battery.detail.count')}
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
                {t('battery.voltage')}
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
                {t('battery.detail.memo')}
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
                {loading ? t('battery.form.saving') : t('battery.form.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/**
 * Domain Components Basic Tests
 * ドメイン特化コンポーネントの基本動作確認テスト
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { customRender } from '@/test/test-utils';
import {
  BatteryStatusBadge,
  BatteryShapeSelector, 
  BatteryListItem,
  DeviceTypeSelector,
  DeviceBatterySlot,
  DeviceListItem,
  UserPlanInfo,
  UserPlanLimitIndicator
} from './index';
import type { BatteryInfo, DeviceInfo, BatterySlotInfo, UserPlanInfo as UserPlanInfoType } from './index';

// テスト用のモックデータ
const mockBattery: BatteryInfo = {
  id: 'battery-1',
  name: 'テスト電池',
  shape: 'aa',
  status: 'active',
  voltage: 1.5,
  capacity: 2000,
  installDate: new Date('2024-01-01'),
  lastChecked: new Date('2024-01-15')
};

const mockBatterySlot: BatterySlotInfo = {
  id: 'slot-1',
  slotNumber: 1,
  supportedShapes: ['aa', 'aaa'],
  battery: mockBattery,
  required: true
};

const mockDevice: DeviceInfo = {
  id: 'device-1',
  name: 'テストデバイス',
  type: 'remote',
  batterySlots: [mockBatterySlot],
  location: 'リビング',
  notes: 'テスト用デバイス',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15')
};

const mockUserPlan: UserPlanInfoType = {
  plan: 'premium',
  limits: {
    maxDevices: 50,
    maxBatteries: 200,
    maxNotifications: 10,
    hasAdvancedAnalytics: true,
    hasExport: true,
    hasApiAccess: false
  },
  usage: {
    devices: 15,
    batteries: 45,
    notifications: 3
  },
  subscriptionEnd: new Date('2024-12-31')
};

describe('Battery Domain Components', () => {
  it('should render BatteryStatusBadge without crashing', () => {
    const { getByText } = customRender(
      <BatteryStatusBadge status="active" />
    );
    expect(getByText('✅ 正常')).toBeInTheDocument();
  });

  it('should render BatteryShapeSelector without crashing', () => {
    const { getAllByText } = customRender(
      <BatteryShapeSelector value="aa" onChange={() => {}} />
    );
    expect(getAllByText('AA')[0]).toBeInTheDocument();
  });

  it('should render BatteryListItem without crashing', () => {
    const { getByText } = customRender(
      <BatteryListItem battery={mockBattery} />
    );
    expect(getByText('テスト電池')).toBeInTheDocument();
  });
});

describe('Device Domain Components', () => {
  it('should render DeviceTypeSelector without crashing', () => {
    const { getAllByText } = customRender(
      <DeviceTypeSelector value="remote" onChange={() => {}} />
    );
    expect(getAllByText('リモコン')[0]).toBeInTheDocument();
  });

  it('should render DeviceBatterySlot without crashing', () => {
    const { getByText } = customRender(
      <DeviceBatterySlot slot={mockBatterySlot} />
    );
    expect(getByText('スロット 1')).toBeInTheDocument();
  });

  it('should render DeviceListItem without crashing', () => {
    const { getByText } = customRender(
      <DeviceListItem device={mockDevice} />
    );
    expect(getByText('テストデバイス')).toBeInTheDocument();
  });
});

describe('User Domain Components', () => {
  it('should render UserPlanInfo without crashing', () => {
    const { getAllByText } = customRender(
      <UserPlanInfo planInfo={mockUserPlan} />
    );
    expect(getAllByText('プレミアムプラン')[0]).toBeInTheDocument();
  });

  it('should render UserPlanLimitIndicator without crashing', () => {
    const { getByText } = customRender(
      <UserPlanLimitIndicator 
        label="デバイス" 
        current={15} 
        max={50} 
        unit="台"
      />
    );
    expect(getByText('デバイス')).toBeInTheDocument();
    expect(getByText('15 / 50台')).toBeInTheDocument();
  });
});

describe('Component Interactions', () => {
  it('should handle BatteryShapeSelector change', () => {
    const handleChange = vi.fn();
    const { getByText } = customRender(
      <BatteryShapeSelector onChange={handleChange} />
    );
    
    const aaButton = getByText('AA');
    aaButton.click();
    
    expect(handleChange).toHaveBeenCalledWith('aa');
  });

  it('should handle DeviceTypeSelector change', () => {
    const handleChange = vi.fn();
    const { getAllByText } = customRender(
      <DeviceTypeSelector onChange={handleChange} />
    );
    
    const remoteButton = getAllByText('リモコン')[0];
    remoteButton.click();
    
    expect(handleChange).toHaveBeenCalledWith('remote');
  });

  it('should handle BatteryListItem click', () => {
    const handleClick = vi.fn();
    const { container } = customRender(
      <BatteryListItem battery={mockBattery} onClick={handleClick} selectable />
    );
    
    const batteryItem = container.firstChild as HTMLElement;
    batteryItem.click();
    
    expect(handleClick).toHaveBeenCalledWith(mockBattery);
  });
});
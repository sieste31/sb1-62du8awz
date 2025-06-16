/**
 * Composed Components Basic Tests
 * 組み合わせコンポーネントの基本動作確認テスト
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { customRender } from '@/test/test-utils';
import { 
  FormField, 
  BaseListItem, 
  StatusBadge, 
  StatusIndicator,
  ConfirmModal 
} from './index';

describe('Composed Components Basic Rendering', () => {
  it('should render FormField without crashing', () => {
    const { getByRole } = customRender(
      <FormField label="Test Field" inputProps={{ placeholder: "test" }} />
    );
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('should render BaseListItem without crashing', () => {
    const { getByText } = customRender(
      <BaseListItem title="Test Item" />
    );
    expect(getByText('Test Item')).toBeInTheDocument();
  });

  it('should render StatusBadge without crashing', () => {
    const { getByText } = customRender(
      <StatusBadge status="success" label="Success" />
    );
    expect(getByText('Success')).toBeInTheDocument();
  });

  it('should render StatusIndicator without crashing', () => {
    const { container } = customRender(
      <StatusIndicator status="success" label="Success indicator" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render ConfirmModal when open', () => {
    const { getByText } = customRender(
      <ConfirmModal 
        open={true} 
        message="Are you sure?" 
        onClose={() => {}}
      />
    );
    expect(getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should not render ConfirmModal when closed', () => {
    const { queryByText } = customRender(
      <ConfirmModal 
        open={false} 
        message="Are you sure?" 
        onClose={() => {}}
      />
    );
    expect(queryByText('Are you sure?')).not.toBeInTheDocument();
  });
});
/**
 * Badge Component Tests
 * Badgeコンポーネントのユニットテスト
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { customRender, setupUser } from '@/test/test-utils';
import { Badge } from './Badge';

describe('Badge', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      customRender(<Badge>Badge</Badge>);
    });

    it('should render text content', () => {
      const { getByText } = customRender(<Badge>Test Badge</Badge>);
      expect(getByText('Test Badge')).toBeInTheDocument();
    });

    it('should have correct base classes', () => {
      const { getByText } = customRender(<Badge>Badge</Badge>);
      const badge = getByText('Badge');
      expect(badge).toHaveClass('inline-flex', 'items-center', 'font-medium');
    });
  });

  describe('Variants', () => {
    it('should render primary variant by default', () => {
      const { getByText } = customRender(<Badge>Badge</Badge>);
      const badge = getByText('Badge');
      expect(badge).toHaveClass('bg-blue-100');
    });

    it('should render secondary variant', () => {
      const { getByText } = customRender(
        <Badge variant="secondary">Badge</Badge>
      );
      const badge = getByText('Badge');
      expect(badge).toHaveClass('bg-gray-100');
    });

    it('should render success variant', () => {
      const { getByText } = customRender(
        <Badge variant="success">Badge</Badge>
      );
      const badge = getByText('Badge');
      expect(badge).toHaveClass('bg-green-100');
    });
  });

  describe('Sizes', () => {
    it('should render small size by default', () => {
      const { getByText } = customRender(<Badge>Badge</Badge>);
      const badge = getByText('Badge');
      expect(badge).toHaveClass('px-2', 'py-1');
    });

    it('should render extra small size', () => {
      const { getByText } = customRender(<Badge size="xs">Badge</Badge>);
      const badge = getByText('Badge');
      expect(badge).toHaveClass('px-1', 'py-1');
    });

    it('should render medium size', () => {
      const { getByText } = customRender(<Badge size="md">Badge</Badge>);
      const badge = getByText('Badge');
      expect(badge).toHaveClass('px-4', 'py-2');
    });
  });

  describe('Dot Badge', () => {
    it('should render as dot when dot prop is true', () => {
      const { container } = customRender(<Badge dot />);
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass('w-2', 'h-2', 'rounded-full');
    });

    it('should not render children when dot is true', () => {
      const { container } = customRender(<Badge dot>Badge Text</Badge>);
      expect(container.firstChild).not.toHaveTextContent('Badge Text');
    });
  });

  describe('Icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;

    it('should render left icon', () => {
      const { getByTestId } = customRender(
        <Badge leftIcon={<TestIcon />}>Badge</Badge>
      );
      expect(getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
      const { getByTestId } = customRender(
        <Badge rightIcon={<TestIcon />}>Badge</Badge>
      );
      expect(getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should not render right icon when removable', () => {
      const { queryByTestId } = customRender(
        <Badge rightIcon={<TestIcon />} removable onRemove={() => {}}>
          Badge
        </Badge>
      );
      expect(queryByTestId('test-icon')).not.toBeInTheDocument();
    });
  });

  describe('Removable Badge', () => {
    it('should render remove button when removable', () => {
      const { container } = customRender(
        <Badge removable onRemove={() => {}}>Badge</Badge>
      );
      const removeButton = container.querySelector('button');
      expect(removeButton).toBeInTheDocument();
    });

    it('should call onRemove when remove button is clicked', async () => {
      const handleRemove = vi.fn();
      const user = setupUser();
      
      const { container } = customRender(
        <Badge removable onRemove={handleRemove}>Badge</Badge>
      );
      
      const removeButton = container.querySelector('button')!;
      await user.click(removeButton);
      
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('should stop propagation on remove button click', async () => {
      const handleRemove = vi.fn();
      const handleBadgeClick = vi.fn();
      const user = setupUser();
      
      const { container } = customRender(
        <div onClick={handleBadgeClick}>
          <Badge removable onRemove={handleRemove}>Badge</Badge>
        </div>
      );
      
      const removeButton = container.querySelector('button')!;
      await user.click(removeButton);
      
      expect(handleRemove).toHaveBeenCalledTimes(1);
      expect(handleBadgeClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label for remove button', () => {
      const { container } = customRender(
        <Badge removable onRemove={() => {}}>Badge</Badge>
      );
      const removeButton = container.querySelector('button');
      expect(removeButton).toHaveAttribute('aria-label', '削除');
    });

    it('should be focusable when removable', () => {
      const { container } = customRender(
        <Badge removable onRemove={() => {}}>Badge</Badge>
      );
      const removeButton = container.querySelector('button');
      expect(removeButton).toHaveClass('focus:outline-none', 'focus:ring-1');
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      const { getByText } = customRender(
        <Badge className="custom-class">Badge</Badge>
      );
      const badge = getByText('Badge');
      expect(badge).toHaveClass('custom-class');
    });

    it('should pass through HTML attributes', () => {
      const { getByText } = customRender(
        <Badge data-testid="custom-badge" id="badge-1">Badge</Badge>
      );
      const badge = getByText('Badge');
      expect(badge).toHaveAttribute('data-testid', 'custom-badge');
      expect(badge).toHaveAttribute('id', 'badge-1');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLSpanElement>();
      customRender(<Badge ref={ref}>Badge</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });
});
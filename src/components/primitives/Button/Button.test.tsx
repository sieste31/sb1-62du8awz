/**
 * Button Component Tests
 * Buttonコンポーネントのユニットテスト
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { customRender, setupUser, expectToHaveClasses } from '@/test/test-utils';
import { Button } from './Button';
import type { ButtonProps } from './types';

describe('Button', () => {
  const defaultProps: ButtonProps = {
    children: 'Test Button',
  };

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      customRender(<Button {...defaultProps} />);
    });

    it('should render with correct text content', () => {
      const { getByRole } = customRender(<Button {...defaultProps} />);
      expect(getByRole('button')).toHaveTextContent('Test Button');
    });

    it('should have correct default type', () => {
      const { getByRole } = customRender(<Button {...defaultProps} />);
      expect(getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('should accept custom type', () => {
      const { getByRole } = customRender(<Button type="submit">Submit</Button>);
      expect(getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('Variants', () => {
    it('should render primary variant by default', () => {
      const { getByRole } = customRender(<Button {...defaultProps} />);
      const button = getByRole('button');
      expect(button).toHaveClass('bg-blue-500');
    });

    it('should render secondary variant', () => {
      const { getByRole } = customRender(
        <Button variant="secondary">{defaultProps.children}</Button>
      );
      const button = getByRole('button');
      expect(button).toHaveClass('bg-gray-200');
    });

    it('should render outline variant', () => {
      const { getByRole } = customRender(
        <Button variant="outline">{defaultProps.children}</Button>
      );
      const button = getByRole('button');
      expect(button).toHaveClass('border-2', 'border-current', 'bg-transparent');
    });

    it('should render ghost variant', () => {
      const { getByRole } = customRender(
        <Button variant="ghost">{defaultProps.children}</Button>
      );
      const button = getByRole('button');
      expect(button).toHaveClass('bg-transparent');
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      const { getByRole } = customRender(<Button {...defaultProps} />);
      const button = getByRole('button');
      expect(button).toHaveClass('px-6', 'py-4');
    });

    it('should render small size', () => {
      const { getByRole } = customRender(
        <Button size="sm">{defaultProps.children}</Button>
      );
      const button = getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2');
    });

    it('should render large size', () => {
      const { getByRole } = customRender(
        <Button size="lg">{defaultProps.children}</Button>
      );
      const button = getByRole('button');
      expect(button).toHaveClass('px-8', 'py-6');
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      const { getByRole } = customRender(
        <Button disabled>{defaultProps.children}</Button>
      );
      const button = getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });

    it('should show loading state', () => {
      const { getByRole } = customRender(
        <Button loading>{defaultProps.children}</Button>
      );
      const button = getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-75', 'cursor-wait');
    });

    it('should show loading spinner when loading', () => {
      const { container } = customRender(
        <Button loading>{defaultProps.children}</Button>
      );
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should not show text when loading and iconOnly', () => {
      const { getByRole } = customRender(
        <Button loading iconOnly>
          {defaultProps.children}
        </Button>
      );
      const button = getByRole('button');
      expect(button).not.toHaveTextContent('Test Button');
    });
  });

  describe('Layout Props', () => {
    it('should render full width when fullWidth is true', () => {
      const { getByRole } = customRender(
        <Button fullWidth>{defaultProps.children}</Button>
      );
      const button = getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('should render as icon-only button', () => {
      const { getByRole } = customRender(
        <Button iconOnly>{defaultProps.children}</Button>
      );
      const button = getByRole('button');
      expect(button).toHaveClass('aspect-square', 'p-0');
    });

    it('should apply custom rounded prop', () => {
      const { getByRole } = customRender(
        <Button rounded="full">{defaultProps.children}</Button>
      );
      const button = getByRole('button');
      expect(button).toHaveClass('rounded-full');
    });
  });

  describe('Icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;

    it('should render left icon', () => {
      const { getByTestId } = customRender(
        <Button leftIcon={<TestIcon />}>{defaultProps.children}</Button>
      );
      expect(getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
      const { getByTestId } = customRender(
        <Button rightIcon={<TestIcon />}>{defaultProps.children}</Button>
      );
      expect(getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should not render icons when loading', () => {
      const { queryByTestId } = customRender(
        <Button
          loading
          leftIcon={<TestIcon />}
          rightIcon={<TestIcon />}
        >
          {defaultProps.children}
        </Button>
      );
      expect(queryByTestId('test-icon')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = setupUser();
      
      const { getByRole } = customRender(
        <Button onClick={handleClick}>{defaultProps.children}</Button>
      );
      
      await user.click(getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = setupUser();
      
      const { getByRole } = customRender(
        <Button disabled onClick={handleClick}>
          {defaultProps.children}
        </Button>
      );
      
      await user.click(getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const handleClick = vi.fn();
      const user = setupUser();
      
      const { getByRole } = customRender(
        <Button loading onClick={handleClick}>
          {defaultProps.children}
        </Button>
      );
      
      await user.click(getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      const { getByRole } = customRender(
        <Button className="custom-class">{defaultProps.children}</Button>
      );
      const button = getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should pass through other HTML attributes', () => {
      const { getByRole } = customRender(
        <Button data-testid="custom-button" aria-label="Custom Label">
          {defaultProps.children}
        </Button>
      );
      const button = getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('aria-label', 'Custom Label');
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      const { getByRole } = customRender(<Button {...defaultProps} />);
      const button = getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('should have proper focus styles', () => {
      const { getByRole } = customRender(<Button {...defaultProps} />);
      const button = getByRole('button');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
    });

    it('should not be focusable when disabled', () => {
      const { getByRole } = customRender(
        <Button disabled>{defaultProps.children}</Button>
      );
      const button = getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      customRender(<Button ref={ref}>{defaultProps.children}</Button>);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveTextContent('Test Button');
    });
  });
});
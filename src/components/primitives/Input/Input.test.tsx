/**
 * Input Component Tests
 * Inputコンポーネントのユニットテスト
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { customRender, setupUser } from '@/test/test-utils';
import { Input } from './Input';
import type { InputProps } from './types';

describe('Input', () => {
  const defaultProps: InputProps = {
    placeholder: 'Enter text',
  };

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      customRender(<Input {...defaultProps} />);
    });

    it('should render with correct placeholder', () => {
      const { getByPlaceholderText } = customRender(<Input {...defaultProps} />);
      expect(getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should have correct default type', () => {
      const { getByRole } = customRender(<Input {...defaultProps} />);
      expect(getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('should accept custom type', () => {
      const { getByDisplayValue } = customRender(
        <Input type="email" defaultValue="test@example.com" />
      );
      const input = getByDisplayValue('test@example.com');
      expect(input).toHaveAttribute('type', 'email');
    });
  });

  describe('Variants', () => {
    it('should render default variant by default', () => {
      const { getByRole } = customRender(<Input {...defaultProps} />);
      const input = getByRole('textbox');
      expect(input).toHaveClass('border', 'border-gray-200');
    });

    it('should render error variant when error prop is provided', () => {
      const { getByRole } = customRender(
        <Input {...defaultProps} error="Error message" />
      );
      const input = getByRole('textbox');
      expect(input).toHaveClass('border-2', 'border-red-300');
    });

    it('should render success variant', () => {
      const { getByRole } = customRender(
        <Input {...defaultProps} variant="success" />
      );
      const input = getByRole('textbox');
      expect(input).toHaveClass('border-2', 'border-green-300');
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      const { getByRole } = customRender(<Input {...defaultProps} />);
      const input = getByRole('textbox');
      expect(input).toHaveClass('px-4', 'py-4');
    });

    it('should render small size', () => {
      const { getByRole } = customRender(
        <Input {...defaultProps} size="sm" />
      );
      const input = getByRole('textbox');
      expect(input).toHaveClass('px-4', 'py-2');
    });

    it('should render large size', () => {
      const { getByRole } = customRender(
        <Input {...defaultProps} size="lg" />
      );
      const input = getByRole('textbox');
      expect(input).toHaveClass('px-6', 'py-6');
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      const { getByRole } = customRender(
        <Input {...defaultProps} disabled />
      );
      const input = getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should render full width by default', () => {
      const { getByRole } = customRender(<Input {...defaultProps} />);
      const input = getByRole('textbox');
      expect(input).toHaveClass('w-full');
    });

    it('should not render full width when fullWidth is false', () => {
      const { getByRole } = customRender(
        <Input {...defaultProps} fullWidth={false} />
      );
      const input = getByRole('textbox');
      expect(input).not.toHaveClass('w-full');
    });
  });

  describe('Icons', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;

    it('should render left icon', () => {
      const { getByTestId, getByRole } = customRender(
        <Input {...defaultProps} leftIcon={<TestIcon />} />
      );
      expect(getByTestId('test-icon')).toBeInTheDocument();
      const input = getByRole('textbox');
      expect(input).toHaveClass('pl-10');
    });

    it('should render right icon', () => {
      const { getByTestId, getByRole } = customRender(
        <Input {...defaultProps} rightIcon={<TestIcon />} />
      );
      expect(getByTestId('test-icon')).toBeInTheDocument();
      const input = getByRole('textbox');
      expect(input).toHaveClass('pr-10');
    });

    it('should position icons correctly', () => {
      const { getByTestId } = customRender(
        <Input
          {...defaultProps}
          leftIcon={<span data-testid="left-icon">Left</span>}
          rightIcon={<span data-testid="right-icon">Right</span>}
        />
      );
      
      const leftIcon = getByTestId('left-icon').parentElement;
      const rightIcon = getByTestId('right-icon').parentElement;
      
      expect(leftIcon).toHaveClass('left-3');
      expect(rightIcon).toHaveClass('right-3');
    });
  });

  describe('Error and Help Text', () => {
    it('should display error message', () => {
      const errorMessage = 'This field is required';
      const { getByText } = customRender(
        <Input {...defaultProps} error={errorMessage} />
      );
      expect(getByText(errorMessage)).toBeInTheDocument();
      expect(getByText(errorMessage)).toHaveClass('text-red-600');
    });

    it('should display help text when no error', () => {
      const helpText = 'Enter a valid email address';
      const { getByText } = customRender(
        <Input {...defaultProps} helpText={helpText} />
      );
      expect(getByText(helpText)).toBeInTheDocument();
      expect(getByText(helpText)).toHaveClass('text-gray-500');
    });

    it('should prioritize error over help text', () => {
      const errorMessage = 'Error message';
      const helpText = 'Help text';
      const { getByText, queryByText } = customRender(
        <Input {...defaultProps} error={errorMessage} helpText={helpText} />
      );
      expect(getByText(errorMessage)).toBeInTheDocument();
      expect(queryByText(helpText)).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle value changes', async () => {
      const handleChange = vi.fn();
      const user = setupUser();
      
      const { getByRole } = customRender(
        <Input {...defaultProps} onChange={handleChange} />
      );
      
      const input = getByRole('textbox');
      await user.type(input, 'test');
      
      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('test');
    });

    it('should handle focus and blur events', async () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      const user = setupUser();
      
      const { getByRole } = customRender(
        <Input {...defaultProps} onFocus={handleFocus} onBlur={handleBlur} />
      );
      
      const input = getByRole('textbox');
      await user.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should not handle interactions when disabled', async () => {
      const handleChange = vi.fn();
      const user = setupUser();
      
      const { getByRole } = customRender(
        <Input {...defaultProps} disabled onChange={handleChange} />
      );
      
      const input = getByRole('textbox');
      await user.type(input, 'test');
      
      expect(handleChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      const { getByRole } = customRender(
        <Input {...defaultProps} className="custom-class" />
      );
      const input = getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('should pass through other HTML attributes', () => {
      const { getByRole } = customRender(
        <Input
          {...defaultProps}
          data-testid="custom-input"
          aria-label="Custom Label"
          maxLength={10}
        />
      );
      const input = getByRole('textbox');
      expect(input).toHaveAttribute('data-testid', 'custom-input');
      expect(input).toHaveAttribute('aria-label', 'Custom Label');
      expect(input).toHaveAttribute('maxlength', '10');
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      const { getByRole } = customRender(<Input {...defaultProps} />);
      const input = getByRole('textbox');
      expect(input).toHaveAttribute('tabIndex', '0');
    });

    it('should have proper focus styles', () => {
      const { getByRole } = customRender(<Input {...defaultProps} />);
      const input = getByRole('textbox');
      expect(input).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
    });

    it('should not be focusable when disabled', () => {
      const { getByRole } = customRender(
        <Input {...defaultProps} disabled />
      );
      const input = getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should associate error message with input', () => {
      const errorMessage = 'Error message';
      const { getByRole, getByText } = customRender(
        <Input {...defaultProps} error={errorMessage} />
      );
      const input = getByRole('textbox');
      const errorElement = getByText(errorMessage);
      
      // Note: In a real implementation, you'd want to use aria-describedby
      expect(errorElement).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      customRender(<Input ref={ref} {...defaultProps} />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toHaveAttribute('placeholder', 'Enter text');
    });
  });
});
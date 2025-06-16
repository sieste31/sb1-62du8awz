/**
 * Select Component Tests
 * Selectコンポーネントのユニットテスト
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { customRender, setupUser } from '@/test/test-utils';
import { Select } from './Select';
import type { SelectProps } from './types';

describe('Select', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ];

  const defaultProps: SelectProps = {
    options: mockOptions,
  };

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      customRender(<Select {...defaultProps} />);
    });

    it('should render as select element', () => {
      const { getByRole } = customRender(<Select {...defaultProps} />);
      expect(getByRole('combobox')).toBeInstanceOf(HTMLSelectElement);
    });

    it('should render all options', () => {
      const { getByRole } = customRender(<Select {...defaultProps} />);
      const select = getByRole('combobox') as HTMLSelectElement;
      const options = Array.from(select.options);
      
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent('Option 1');
      expect(options[1]).toHaveTextContent('Option 2');
      expect(options[2]).toHaveTextContent('Option 3');
    });

    it('should render placeholder option when provided', () => {
      const { getByRole } = customRender(
        <Select {...defaultProps} placeholder="Choose an option" />
      );
      const select = getByRole('combobox') as HTMLSelectElement;
      const options = Array.from(select.options);
      
      expect(options[0]).toHaveTextContent('Choose an option');
      expect(options[0]).toHaveAttribute('disabled');
      expect(options[0]).toHaveValue('');
    });
  });

  describe('Variants', () => {
    it('should render default variant by default', () => {
      const { getByRole } = customRender(<Select {...defaultProps} />);
      const select = getByRole('combobox');
      expect(select).toHaveClass('border', 'border-gray-200');
    });

    it('should render error variant when error prop is provided', () => {
      const { getByRole } = customRender(
        <Select {...defaultProps} error="Error message" />
      );
      const select = getByRole('combobox');
      expect(select).toHaveClass('border-2', 'border-red-300');
    });

    it('should render success variant', () => {
      const { getByRole } = customRender(
        <Select {...defaultProps} variant="success" />
      );
      const select = getByRole('combobox');
      expect(select).toHaveClass('border-2', 'border-green-300');
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      const { getByRole } = customRender(<Select {...defaultProps} />);
      const select = getByRole('combobox');
      expect(select).toHaveClass('px-4', 'py-4');
    });

    it('should render small size', () => {
      const { getByRole } = customRender(
        <Select {...defaultProps} size="sm" />
      );
      const select = getByRole('combobox');
      expect(select).toHaveClass('px-4', 'py-2');
    });

    it('should render large size', () => {
      const { getByRole } = customRender(
        <Select {...defaultProps} size="lg" />
      );
      const select = getByRole('combobox');
      expect(select).toHaveClass('px-6', 'py-6');
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      const { getByRole } = customRender(
        <Select {...defaultProps} disabled />
      );
      const select = getByRole('combobox');
      expect(select).toBeDisabled();
      expect(select).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should render full width by default', () => {
      const { getByRole } = customRender(<Select {...defaultProps} />);
      const select = getByRole('combobox');
      expect(select).toHaveClass('w-full');
    });

    it('should not render full width when fullWidth is false', () => {
      const { getByRole } = customRender(
        <Select {...defaultProps} fullWidth={false} />
      );
      const select = getByRole('combobox');
      expect(select).not.toHaveClass('w-full');
    });

    it('should have dropdown arrow icon', () => {
      const { container } = customRender(<Select {...defaultProps} />);
      const arrow = container.querySelector('svg');
      expect(arrow).toBeInTheDocument();
      expect(arrow).toHaveClass('w-4', 'h-4', 'text-gray-400');
    });
  });

  describe('Option Handling', () => {
    it('should handle disabled options', () => {
      const { getByRole } = customRender(<Select {...defaultProps} />);
      const select = getByRole('combobox') as HTMLSelectElement;
      const disabledOption = Array.from(select.options).find(
        option => option.value === 'option3'
      );
      
      expect(disabledOption).toHaveAttribute('disabled');
    });

    it('should handle empty options array', () => {
      const { getByRole } = customRender(
        <Select options={[]} />
      );
      const select = getByRole('combobox') as HTMLSelectElement;
      expect(select.options).toHaveLength(0);
    });

    it('should handle options with same values', () => {
      const duplicateOptions = [
        { value: 'test', label: 'Test 1' },
        { value: 'test', label: 'Test 2' },
      ];
      
      const { getByRole } = customRender(
        <Select options={duplicateOptions} />
      );
      const select = getByRole('combobox') as HTMLSelectElement;
      expect(select.options).toHaveLength(2);
    });
  });

  describe('Error and Help Text', () => {
    it('should display error message', () => {
      const errorMessage = 'Please select an option';
      const { getByText } = customRender(
        <Select {...defaultProps} error={errorMessage} />
      );
      expect(getByText(errorMessage)).toBeInTheDocument();
      expect(getByText(errorMessage)).toHaveClass('text-red-600');
    });

    it('should display help text when no error', () => {
      const helpText = 'Choose the best option for you';
      const { getByText } = customRender(
        <Select {...defaultProps} helpText={helpText} />
      );
      expect(getByText(helpText)).toBeInTheDocument();
      expect(getByText(helpText)).toHaveClass('text-gray-500');
    });

    it('should prioritize error over help text', () => {
      const errorMessage = 'Error message';
      const helpText = 'Help text';
      const { getByText, queryByText } = customRender(
        <Select {...defaultProps} error={errorMessage} helpText={helpText} />
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
        <Select {...defaultProps} onChange={handleChange} />
      );
      
      const select = getByRole('combobox');
      await user.selectOptions(select, 'option2');
      
      expect(handleChange).toHaveBeenCalled();
      expect(select).toHaveValue('option2');
    });

    it('should handle focus and blur events', async () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      const user = setupUser();
      
      const { getByRole } = customRender(
        <Select {...defaultProps} onFocus={handleFocus} onBlur={handleBlur} />
      );
      
      const select = getByRole('combobox');
      await user.click(select);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should not handle interactions when disabled', async () => {
      const handleChange = vi.fn();
      const user = setupUser();
      
      const { getByRole } = customRender(
        <Select {...defaultProps} disabled onChange={handleChange} />
      );
      
      const select = getByRole('combobox');
      await user.selectOptions(select, 'option2');
      
      expect(handleChange).not.toHaveBeenCalled();
      expect(select).not.toHaveValue('option2');
    });

    it('should not select disabled options', async () => {
      const handleChange = vi.fn();
      const user = setupUser();
      
      const { getByRole } = customRender(
        <Select {...defaultProps} onChange={handleChange} />
      );
      
      const select = getByRole('combobox');
      
      // Try to select the disabled option
      await user.selectOptions(select, 'option3');
      
      // Should not change the value or call onChange
      expect(select).not.toHaveValue('option3');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation', async () => {
      const user = setupUser();
      
      const { getByRole } = customRender(<Select {...defaultProps} />);
      
      const select = getByRole('combobox');
      await user.click(select);
      
      // Arrow down should select first option
      await user.keyboard('{ArrowDown}');
      expect(select).toHaveValue('option1');
      
      // Arrow down again should select second option
      await user.keyboard('{ArrowDown}');
      expect(select).toHaveValue('option2');
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      const { getByRole } = customRender(
        <Select {...defaultProps} className="custom-class" />
      );
      const select = getByRole('combobox');
      expect(select).toHaveClass('custom-class');
    });

    it('should pass through other HTML attributes', () => {
      const { getByRole } = customRender(
        <Select
          {...defaultProps}
          data-testid="custom-select"
          aria-label="Custom Label"
        />
      );
      const select = getByRole('combobox');
      expect(select).toHaveAttribute('data-testid', 'custom-select');
      expect(select).toHaveAttribute('aria-label', 'Custom Label');
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      const { getByRole } = customRender(<Select {...defaultProps} />);
      const select = getByRole('combobox');
      expect(select).toHaveAttribute('tabIndex', '0');
    });

    it('should have proper focus styles', () => {
      const { getByRole } = customRender(<Select {...defaultProps} />);
      const select = getByRole('combobox');
      expect(select).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
    });

    it('should not be focusable when disabled', () => {
      const { getByRole } = customRender(
        <Select {...defaultProps} disabled />
      );
      const select = getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('should have proper ARIA attributes', () => {
      const { getByRole } = customRender(<Select {...defaultProps} />);
      const select = getByRole('combobox');
      expect(select).toHaveAttribute('role', 'combobox');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to select element', () => {
      const ref = React.createRef<HTMLSelectElement>();
      customRender(<Select ref={ref} {...defaultProps} />);
      
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
      expect(ref.current?.options).toHaveLength(3);
    });
  });
});
/**
 * TextArea Component Tests
 * TextAreaコンポーネントのユニットテスト
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { customRender, setupUser } from '@/test/test-utils';
import { TextArea } from './TextArea';
import type { TextAreaProps } from './types';

describe('TextArea', () => {
  const defaultProps: TextAreaProps = {
    placeholder: 'Enter your message',
  };

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      customRender(<TextArea {...defaultProps} />);
    });

    it('should render with correct placeholder', () => {
      const { getByPlaceholderText } = customRender(<TextArea {...defaultProps} />);
      expect(getByPlaceholderText('Enter your message')).toBeInTheDocument();
    });

    it('should render as textarea element', () => {
      const { getByRole } = customRender(<TextArea {...defaultProps} />);
      expect(getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe('Variants', () => {
    it('should render default variant by default', () => {
      const { getByRole } = customRender(<TextArea {...defaultProps} />);
      const textarea = getByRole('textbox');
      expect(textarea).toHaveClass('border', 'border-gray-200');
    });

    it('should render error variant when error prop is provided', () => {
      const { getByRole } = customRender(
        <TextArea {...defaultProps} error="Error message" />
      );
      const textarea = getByRole('textbox');
      expect(textarea).toHaveClass('border-2', 'border-red-300');
    });

    it('should render success variant', () => {
      const { getByRole } = customRender(
        <TextArea {...defaultProps} variant="success" />
      );
      const textarea = getByRole('textbox');
      expect(textarea).toHaveClass('border-2', 'border-green-300');
    });
  });

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      const { getByRole } = customRender(<TextArea {...defaultProps} />);
      const textarea = getByRole('textbox');
      expect(textarea).toHaveClass('px-4', 'py-4');
    });

    it('should render small size', () => {
      const { getByRole } = customRender(
        <TextArea {...defaultProps} size="sm" />
      );
      const textarea = getByRole('textbox');
      expect(textarea).toHaveClass('px-4', 'py-2');
    });

    it('should render large size', () => {
      const { getByRole } = customRender(
        <TextArea {...defaultProps} size="lg" />
      );
      const textarea = getByRole('textbox');
      expect(textarea).toHaveClass('px-6', 'py-6');
    });
  });

  describe('Resize Behavior', () => {
    it('should be resizable by default', () => {
      const { getByRole } = customRender(<TextArea {...defaultProps} />);
      const textarea = getByRole('textbox');
      expect(textarea).not.toHaveClass('resize-none');
    });

    it('should not be resizable when resize is false', () => {
      const { getByRole } = customRender(
        <TextArea {...defaultProps} resize={false} />
      );
      const textarea = getByRole('textbox');
      expect(textarea).toHaveClass('resize-none');
    });
  });

  describe('Row Configuration', () => {
    it('should have default minimum rows', () => {
      const { getByRole } = customRender(<TextArea {...defaultProps} />);
      const textarea = getByRole('textbox') as HTMLTextAreaElement;
      const style = window.getComputedStyle(textarea);
      expect(style.minHeight).toBe('4.5rem'); // 3 * 1.5rem
    });

    it('should respect custom minRows', () => {
      const { getByRole } = customRender(
        <TextArea {...defaultProps} minRows={5} />
      );
      const textarea = getByRole('textbox') as HTMLTextAreaElement;
      const style = window.getComputedStyle(textarea);
      expect(style.minHeight).toBe('7.5rem'); // 5 * 1.5rem
    });

    it('should respect custom maxRows', () => {
      const { getByRole } = customRender(
        <TextArea {...defaultProps} maxRows={10} />
      );
      const textarea = getByRole('textbox') as HTMLTextAreaElement;
      const style = window.getComputedStyle(textarea);
      expect(style.maxHeight).toBe('15rem'); // 10 * 1.5rem
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      const { getByRole } = customRender(
        <TextArea {...defaultProps} disabled />
      );
      const textarea = getByRole('textbox');
      expect(textarea).toBeDisabled();
      expect(textarea).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should render full width by default', () => {
      const { getByRole } = customRender(<TextArea {...defaultProps} />);
      const textarea = getByRole('textbox');
      expect(textarea).toHaveClass('w-full');
    });

    it('should not render full width when fullWidth is false', () => {
      const { getByRole } = customRender(
        <TextArea {...defaultProps} fullWidth={false} />
      );
      const textarea = getByRole('textbox');
      expect(textarea).not.toHaveClass('w-full');
    });
  });

  describe('Error and Help Text', () => {
    it('should display error message', () => {
      const errorMessage = 'This field is required';
      const { getByText } = customRender(
        <TextArea {...defaultProps} error={errorMessage} />
      );
      expect(getByText(errorMessage)).toBeInTheDocument();
      expect(getByText(errorMessage)).toHaveClass('text-red-600');
    });

    it('should display help text when no error', () => {
      const helpText = 'Enter a detailed description';
      const { getByText } = customRender(
        <TextArea {...defaultProps} helpText={helpText} />
      );
      expect(getByText(helpText)).toBeInTheDocument();
      expect(getByText(helpText)).toHaveClass('text-gray-500');
    });

    it('should prioritize error over help text', () => {
      const errorMessage = 'Error message';
      const helpText = 'Help text';
      const { getByText, queryByText } = customRender(
        <TextArea {...defaultProps} error={errorMessage} helpText={helpText} />
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
        <TextArea {...defaultProps} onChange={handleChange} />
      );
      
      const textarea = getByRole('textbox');
      await user.type(textarea, 'test message');
      
      expect(handleChange).toHaveBeenCalled();
      expect(textarea).toHaveValue('test message');
    });

    it('should handle multiline input', async () => {
      const user = setupUser();
      
      const { getByRole } = customRender(<TextArea {...defaultProps} />);
      
      const textarea = getByRole('textbox');
      await user.type(textarea, 'Line 1{enter}Line 2{enter}Line 3');
      
      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3');
    });

    it('should handle focus and blur events', async () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      const user = setupUser();
      
      const { getByRole } = customRender(
        <TextArea {...defaultProps} onFocus={handleFocus} onBlur={handleBlur} />
      );
      
      const textarea = getByRole('textbox');
      await user.click(textarea);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should not handle interactions when disabled', async () => {
      const handleChange = vi.fn();
      const user = setupUser();
      
      const { getByRole } = customRender(
        <TextArea {...defaultProps} disabled onChange={handleChange} />
      );
      
      const textarea = getByRole('textbox');
      await user.type(textarea, 'test');
      
      expect(handleChange).not.toHaveBeenCalled();
      expect(textarea).toHaveValue('');
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      const { getByRole } = customRender(
        <TextArea {...defaultProps} className="custom-class" />
      );
      const textarea = getByRole('textbox');
      expect(textarea).toHaveClass('custom-class');
    });

    it('should pass through other HTML attributes', () => {
      const { getByRole } = customRender(
        <TextArea
          {...defaultProps}
          data-testid="custom-textarea"
          aria-label="Custom Label"
          maxLength={100}
        />
      );
      const textarea = getByRole('textbox');
      expect(textarea).toHaveAttribute('data-testid', 'custom-textarea');
      expect(textarea).toHaveAttribute('aria-label', 'Custom Label');
      expect(textarea).toHaveAttribute('maxlength', '100');
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      const { getByRole } = customRender(<TextArea {...defaultProps} />);
      const textarea = getByRole('textbox');
      expect(textarea).toHaveAttribute('tabIndex', '0');
    });

    it('should have proper focus styles', () => {
      const { getByRole } = customRender(<TextArea {...defaultProps} />);
      const textarea = getByRole('textbox');
      expect(textarea).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
    });

    it('should not be focusable when disabled', () => {
      const { getByRole } = customRender(
        <TextArea {...defaultProps} disabled />
      );
      const textarea = getByRole('textbox');
      expect(textarea).toBeDisabled();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to textarea element', () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      customRender(<TextArea ref={ref} {...defaultProps} />);
      
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
      expect(ref.current).toHaveAttribute('placeholder', 'Enter your message');
    });
  });
});
/**
 * Card Component Tests
 * Cardコンポーネントのユニットテスト
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { customRender, setupUser } from '@/test/test-utils';
import { Card } from './Card';
import type { CardProps } from './types';

describe('Card', () => {
  const defaultProps: CardProps = {
    children: 'Card content',
  };

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      customRender(<Card {...defaultProps} />);
    });

    it('should render with correct content', () => {
      const { getByText } = customRender(<Card {...defaultProps} />);
      expect(getByText('Card content')).toBeInTheDocument();
    });

    it('should render as div by default', () => {
      const { container } = customRender(<Card {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toBeInstanceOf(HTMLDivElement);
    });

    it('should render as button when clickable', () => {
      const { getByRole } = customRender(
        <Card clickable>{defaultProps.children}</Card>
      );
      expect(getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render default variant by default', () => {
      const { container } = customRender(<Card {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-gray-50', 'border', 'border-gray-200');
    });

    it('should render elevated variant', () => {
      const { container } = customRender(
        <Card variant="elevated">{defaultProps.children}</Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('shadow-md');
    });

    it('should render outlined variant', () => {
      const { container } = customRender(
        <Card variant="outlined">{defaultProps.children}</Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('border-2', 'border-gray-300');
    });

    it('should render ghost variant', () => {
      const { container } = customRender(
        <Card variant="ghost">{defaultProps.children}</Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-transparent', 'border-0');
    });
  });

  describe('Padding', () => {
    it('should render medium padding by default', () => {
      const { container } = customRender(<Card {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-4');
    });

    it('should render no padding', () => {
      const { container } = customRender(
        <Card padding="none">{defaultProps.children}</Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-0');
    });

    it('should render small padding', () => {
      const { container } = customRender(
        <Card padding="sm">{defaultProps.children}</Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-2');
    });

    it('should render large padding', () => {
      const { container } = customRender(
        <Card padding="lg">{defaultProps.children}</Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-6');
    });
  });

  describe('Interactive States', () => {
    it('should have cursor pointer when clickable', () => {
      const { getByRole } = customRender(
        <Card clickable>{defaultProps.children}</Card>
      );
      const card = getByRole('button');
      expect(card).toHaveClass('cursor-pointer');
    });

    it('should have hover effects when hoverable', () => {
      const { container } = customRender(
        <Card hoverable>{defaultProps.children}</Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('hover:shadow-lg', 'hover:scale-[1.02]');
    });

    it('should have hover effects when clickable', () => {
      const { getByRole } = customRender(
        <Card clickable>{defaultProps.children}</Card>
      );
      const card = getByRole('button');
      expect(card).toHaveClass('hover:shadow-lg', 'hover:scale-[1.02]');
    });

    it('should have active effects when clickable', () => {
      const { getByRole } = customRender(
        <Card clickable>{defaultProps.children}</Card>
      );
      const card = getByRole('button');
      expect(card).toHaveClass('active:scale-[0.98]');
    });
  });

  describe('Rounded Corners', () => {
    it('should have medium rounded corners by default', () => {
      const { container } = customRender(<Card {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('rounded-md');
    });

    it('should accept custom rounded prop', () => {
      const { container } = customRender(
        <Card rounded="lg">{defaultProps.children}</Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('rounded-lg');
    });

    it('should render without rounded corners', () => {
      const { container } = customRender(
        <Card rounded="none">{defaultProps.children}</Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('rounded-none');
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked and clickable', async () => {
      const handleClick = vi.fn();
      const user = setupUser();
      
      const { getByRole } = customRender(
        <Card clickable onClick={handleClick}>
          {defaultProps.children}
        </Card>
      );
      
      await user.click(getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not be clickable by default', async () => {
      const handleClick = vi.fn();
      const user = setupUser();
      
      const { container } = customRender(
        <Card onClick={handleClick}>{defaultProps.children}</Card>
      );
      
      await user.click(container.firstChild as HTMLElement);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should have proper button type when clickable', () => {
      const { getByRole } = customRender(
        <Card clickable>{defaultProps.children}</Card>
      );
      const button = getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Accessibility', () => {
    it('should be focusable when clickable', () => {
      const { getByRole } = customRender(
        <Card clickable>{defaultProps.children}</Card>
      );
      const button = getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('should not be focusable when not clickable', () => {
      const { container } = customRender(<Card {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveAttribute('tabIndex');
    });

    it('should support keyboard interaction when clickable', async () => {
      const handleClick = vi.fn();
      const user = setupUser();
      
      const { getByRole } = customRender(
        <Card clickable onClick={handleClick}>
          {defaultProps.children}
        </Card>
      );
      
      const button = getByRole('button');
      await user.click(button);
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      
      // Should be called once for click, once for Enter, once for Space
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      const { container } = customRender(
        <Card className="custom-class">{defaultProps.children}</Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });

    it('should pass through other HTML attributes', () => {
      const { container } = customRender(
        <Card
          data-testid="custom-card"
          aria-label="Custom Card"
          id="card-1"
        >
          {defaultProps.children}
        </Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute('data-testid', 'custom-card');
      expect(card).toHaveAttribute('aria-label', 'Custom Card');
      expect(card).toHaveAttribute('id', 'card-1');
    });

    it('should handle complex children', () => {
      const complexChildren = (
        <div>
          <h2>Title</h2>
          <p>Description</p>
          <button>Action</button>
        </div>
      );
      
      const { getByText } = customRender(
        <Card>{complexChildren}</Card>
      );
      
      expect(getByText('Title')).toBeInTheDocument();
      expect(getByText('Description')).toBeInTheDocument();
      expect(getByText('Action')).toBeInTheDocument();
    });
  });

  describe('Style Composition', () => {
    it('should properly combine all style classes', () => {
      const { container } = customRender(
        <Card
          variant="elevated"
          padding="lg"
          rounded="xl"
          hoverable
          className="custom-class"
        >
          {defaultProps.children}
        </Card>
      );
      const card = container.firstChild as HTMLElement;
      
      expect(card).toHaveClass(
        'relative',
        'overflow-hidden',
        'bg-gray-50',
        'shadow-md',
        'p-6',
        'rounded-xl',
        'hover:shadow-lg',
        'hover:scale-[1.02]',
        'custom-class'
      );
    });

    it('should handle transitions properly', () => {
      const { container } = customRender(<Card {...defaultProps} />);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('transition-all', 'duration-200', 'ease-in-out');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to div element when not clickable', () => {
      const ref = React.createRef<HTMLDivElement>();
      customRender(<Card ref={ref}>{defaultProps.children}</Card>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveTextContent('Card content');
    });

    it('should forward ref to button element when clickable', () => {
      const ref = React.createRef<HTMLButtonElement>();
      customRender(<Card ref={ref} clickable>{defaultProps.children}</Card>);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveTextContent('Card content');
    });
  });
});
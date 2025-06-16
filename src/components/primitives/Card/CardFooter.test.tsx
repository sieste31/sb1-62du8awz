/**
 * CardFooter Component Tests
 * CardFooterコンポーネントのユニットテスト
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { customRender } from '@/test/test-utils';
import { CardFooter } from './CardFooter';

describe('CardFooter', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      customRender(<CardFooter />);
    });

    it('should render children content', () => {
      const { getByText } = customRender(
        <CardFooter>Footer content</CardFooter>
      );
      expect(getByText('Footer content')).toBeInTheDocument();
    });

    it('should have correct base classes', () => {
      const { container } = customRender(<CardFooter>Footer</CardFooter>);
      const footer = container.firstChild as HTMLElement;
      expect(footer).toHaveClass('flex', 'items-center', 'py-4');
    });
  });

  describe('Justify Alignment', () => {
    it('should justify end by default', () => {
      const { container } = customRender(<CardFooter>Footer</CardFooter>);
      const footer = container.firstChild as HTMLElement;
      expect(footer).toHaveClass('justify-end');
    });

    it('should justify start when specified', () => {
      const { container } = customRender(
        <CardFooter justify="start">Footer</CardFooter>
      );
      const footer = container.firstChild as HTMLElement;
      expect(footer).toHaveClass('justify-start');
    });

    it('should justify between when specified', () => {
      const { container } = customRender(
        <CardFooter justify="between">Footer</CardFooter>
      );
      const footer = container.firstChild as HTMLElement;
      expect(footer).toHaveClass('justify-between');
    });
  });

  describe('Divider', () => {
    it('should render divider by default', () => {
      const { container } = customRender(<CardFooter>Footer</CardFooter>);
      const footer = container.firstChild as HTMLElement;
      expect(footer).toHaveClass('border-t', 'border-gray-200', 'pt-4');
    });

    it('should not render divider when disabled', () => {
      const { container } = customRender(
        <CardFooter divider={false}>Footer</CardFooter>
      );
      const footer = container.firstChild as HTMLElement;
      expect(footer).not.toHaveClass('border-t', 'border-gray-200', 'pt-4');
    });
  });

  describe('Actions', () => {
    it('should render actions element', () => {
      const actions = (
        <div>
          <button data-testid="action-1">Action 1</button>
          <button data-testid="action-2">Action 2</button>
        </div>
      );
      
      const { getByTestId } = customRender(
        <CardFooter actions={actions}>Footer</CardFooter>
      );
      
      expect(getByTestId('action-1')).toBeInTheDocument();
      expect(getByTestId('action-2')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      customRender(<CardFooter ref={ref}>Footer</CardFooter>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
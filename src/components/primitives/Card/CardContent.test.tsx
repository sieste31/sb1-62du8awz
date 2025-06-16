/**
 * CardContent Component Tests
 * CardContentコンポーネントのユニットテスト
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { customRender } from '@/test/test-utils';
import { CardContent } from './CardContent';

describe('CardContent', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      customRender(<CardContent />);
    });

    it('should render children content', () => {
      const { getByText } = customRender(
        <CardContent>Content text</CardContent>
      );
      expect(getByText('Content text')).toBeInTheDocument();
    });

    it('should have correct base classes', () => {
      const { container } = customRender(<CardContent>Content</CardContent>);
      const content = container.firstChild as HTMLElement;
      expect(content).toHaveClass('py-4');
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      const { container } = customRender(
        <CardContent className="custom-class">Content</CardContent>
      );
      const content = container.firstChild as HTMLElement;
      expect(content).toHaveClass('custom-class', 'py-4');
    });

    it('should pass through HTML attributes', () => {
      const { container } = customRender(
        <CardContent data-testid="content" id="content-1">
          Content
        </CardContent>
      );
      const content = container.firstChild as HTMLElement;
      expect(content).toHaveAttribute('data-testid', 'content');
      expect(content).toHaveAttribute('id', 'content-1');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      customRender(<CardContent ref={ref}>Content</CardContent>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
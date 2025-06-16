/**
 * CardHeader Component Tests
 * CardHeaderコンポーネントのユニットテスト
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { customRender } from '@/test/test-utils';
import { CardHeader } from './CardHeader';
import type { CardHeaderProps } from './types';

describe('CardHeader', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      customRender(<CardHeader />);
    });

    it('should render with title only', () => {
      const { getByText } = customRender(
        <CardHeader title="Card Title" />
      );
      expect(getByText('Card Title')).toBeInTheDocument();
    });

    it('should render with title and subtitle', () => {
      const { getByText } = customRender(
        <CardHeader title="Card Title" subtitle="Card Subtitle" />
      );
      expect(getByText('Card Title')).toBeInTheDocument();
      expect(getByText('Card Subtitle')).toBeInTheDocument();
    });

    it('should render with children instead of title/subtitle', () => {
      const { getByText } = customRender(
        <CardHeader>
          <div>Custom Content</div>
        </CardHeader>
      );
      expect(getByText('Custom Content')).toBeInTheDocument();
    });
  });

  describe('Title Styling', () => {
    it('should render title with correct heading styles', () => {
      const { getByText } = customRender(
        <CardHeader title="Card Title" />
      );
      const title = getByText('Card Title');
      expect(title.tagName).toBe('H3');
      expect(title).toHaveClass('text-lg', 'font-medium', 'text-gray-900');
    });

    it('should render subtitle with correct text styles', () => {
      const { getByText } = customRender(
        <CardHeader subtitle="Card Subtitle" />
      );
      const subtitle = getByText('Card Subtitle');
      expect(subtitle.tagName).toBe('P');
      expect(subtitle).toHaveClass('text-sm', 'text-gray-600');
    });
  });

  describe('Action Element', () => {
    it('should render action element', () => {
      const ActionButton = () => (
        <button data-testid="action-button">Action</button>
      );
      
      const { getByTestId } = customRender(
        <CardHeader title="Title" action={<ActionButton />} />
      );
      expect(getByTestId('action-button')).toBeInTheDocument();
    });

    it('should position action element correctly', () => {
      const ActionButton = () => (
        <button data-testid="action-button">Action</button>
      );
      
      const { getByTestId } = customRender(
        <CardHeader title="Title" action={<ActionButton />} />
      );
      const actionContainer = getByTestId('action-button').parentElement;
      expect(actionContainer).toHaveClass('flex-shrink-0', 'ml-4');
    });

    it('should render action without title', () => {
      const ActionButton = () => (
        <button data-testid="action-button">Action</button>
      );
      
      const { getByTestId } = customRender(
        <CardHeader action={<ActionButton />} />
      );
      expect(getByTestId('action-button')).toBeInTheDocument();
    });
  });

  describe('Divider', () => {
    it('should render divider by default', () => {
      const { container } = customRender(
        <CardHeader title="Title" />
      );
      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass('border-b', 'border-gray-200', 'pb-4');
    });

    it('should not render divider when divider is false', () => {
      const { container } = customRender(
        <CardHeader title="Title" divider={false} />
      );
      const header = container.firstChild as HTMLElement;
      expect(header).not.toHaveClass('border-b', 'border-gray-200', 'pb-4');
    });
  });

  describe('Layout', () => {
    it('should have proper flex layout', () => {
      const { container } = customRender(
        <CardHeader title="Title" />
      );
      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass('flex', 'items-start', 'justify-between');
    });

    it('should handle content container properly', () => {
      const { getByText } = customRender(
        <CardHeader title="Title" subtitle="Subtitle" />
      );
      const title = getByText('Title');
      const contentContainer = title.parentElement;
      expect(contentContainer).toHaveClass('flex-1', 'min-w-0');
    });

    it('should render without content container when no content', () => {
      const ActionButton = () => (
        <button data-testid="action-button">Action</button>
      );
      
      const { getByTestId, container } = customRender(
        <CardHeader action={<ActionButton />} />
      );
      
      const header = container.firstChild as HTMLElement;
      const contentContainer = header.querySelector('.flex-1');
      expect(contentContainer).not.toBeInTheDocument();
    });
  });

  describe('Content Combinations', () => {
    it('should handle title with action', () => {
      const ActionButton = () => (
        <button data-testid="action-button">Action</button>
      );
      
      const { getByText, getByTestId } = customRender(
        <CardHeader title="Title" action={<ActionButton />} />
      );
      
      expect(getByText('Title')).toBeInTheDocument();
      expect(getByTestId('action-button')).toBeInTheDocument();
    });

    it('should handle subtitle with action', () => {
      const ActionButton = () => (
        <button data-testid="action-button">Action</button>
      );
      
      const { getByText, getByTestId } = customRender(
        <CardHeader subtitle="Subtitle" action={<ActionButton />} />
      );
      
      expect(getByText('Subtitle')).toBeInTheDocument();
      expect(getByTestId('action-button')).toBeInTheDocument();
    });

    it('should handle children with action', () => {
      const ActionButton = () => (
        <button data-testid="action-button">Action</button>
      );
      
      const { getByText, getByTestId } = customRender(
        <CardHeader action={<ActionButton />}>
          <span>Custom Content</span>
        </CardHeader>
      );
      
      expect(getByText('Custom Content')).toBeInTheDocument();
      expect(getByTestId('action-button')).toBeInTheDocument();
    });

    it('should prioritize children over title/subtitle', () => {
      const { getByText, queryByText } = customRender(
        <CardHeader title="Title" subtitle="Subtitle">
          <span>Custom Content</span>
        </CardHeader>
      );
      
      expect(getByText('Custom Content')).toBeInTheDocument();
      expect(queryByText('Title')).not.toBeInTheDocument();
      expect(queryByText('Subtitle')).not.toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      const { container } = customRender(
        <CardHeader className="custom-class" title="Title" />
      );
      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass('custom-class');
    });

    it('should pass through other HTML attributes', () => {
      const { container } = customRender(
        <CardHeader
          data-testid="custom-header"
          aria-label="Custom Header"
          id="header-1"
          title="Title"
        />
      );
      const header = container.firstChild as HTMLElement;
      expect(header).toHaveAttribute('data-testid', 'custom-header');
      expect(header).toHaveAttribute('aria-label', 'Custom Header');
      expect(header).toHaveAttribute('id', 'header-1');
    });
  });

  describe('Typography Handling', () => {
    it('should handle long titles properly', () => {
      const longTitle = 'This is a very long title that might overflow and should be handled properly';
      const { getByText } = customRender(
        <CardHeader title={longTitle} />
      );
      const title = getByText(longTitle);
      expect(title).toBeInTheDocument();
      
      // The container should have min-w-0 to handle text overflow
      const container = title.parentElement;
      expect(container).toHaveClass('min-w-0');
    });

    it('should handle empty strings gracefully', () => {
      const { container } = customRender(
        <CardHeader title="" subtitle="" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Title with <>&"\' characters';
      const { getByText } = customRender(
        <CardHeader title={specialTitle} />
      );
      expect(getByText(specialTitle)).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to header element', () => {
      const ref = React.createRef<HTMLDivElement>();
      customRender(<CardHeader ref={ref} title="Title" />);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('flex', 'items-start', 'justify-between');
    });
  });
});
/**
 * Layout Components Tests
 * Layout関連コンポーネントのユニットテスト
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { customRender } from '@/test/test-utils';
import { Container, Stack, Grid } from './index';

describe('Container', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      customRender(<Container>Content</Container>);
    });

    it('should render children content', () => {
      const { getByText } = customRender(<Container>Test Content</Container>);
      expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('should have correct base classes', () => {
      const { container } = customRender(<Container>Content</Container>);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('w-full');
    });
  });

  describe('Max Width', () => {
    it('should render large max width by default', () => {
      const { container } = customRender(<Container>Content</Container>);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('max-w-lg', 'mx-auto');
    });

    it('should render fluid width', () => {
      const { container } = customRender(
        <Container maxWidth="fluid">Content</Container>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('w-full');
      expect(element).not.toHaveClass('max-w-lg');
    });

    it('should render extra large width', () => {
      const { container } = customRender(
        <Container maxWidth="xl">Content</Container>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('max-w-xl', 'mx-auto');
    });
  });

  describe('Padding', () => {
    it('should render medium padding by default', () => {
      const { container } = customRender(<Container>Content</Container>);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('px-4');
    });

    it('should render no padding', () => {
      const { container } = customRender(
        <Container padding="none">Content</Container>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).not.toHaveClass('px-4');
    });
  });
});

describe('Stack', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      customRender(<Stack>Content</Stack>);
    });

    it('should render children content', () => {
      const { getByText } = customRender(<Stack>Stack Content</Stack>);
      expect(getByText('Stack Content')).toBeInTheDocument();
    });
  });

  describe('Direction', () => {
    it('should render vertical direction by default', () => {
      const { container } = customRender(<Stack>Content</Stack>);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('flex', 'flex-col');
    });

    it('should render horizontal direction', () => {
      const { container } = customRender(
        <Stack direction="horizontal">Content</Stack>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('flex', 'flex-row');
    });
  });

  describe('Spacing', () => {
    it('should render medium spacing by default', () => {
      const { container } = customRender(<Stack>Content</Stack>);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('gap-4');
    });

    it('should render small spacing', () => {
      const { container } = customRender(
        <Stack spacing="sm">Content</Stack>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('gap-2');
    });
  });

  describe('Alignment', () => {
    it('should stretch by default', () => {
      const { container } = customRender(<Stack>Content</Stack>);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('items-stretch');
    });

    it('should align center', () => {
      const { container } = customRender(
        <Stack align="center">Content</Stack>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('items-center');
    });
  });

  describe('Justify', () => {
    it('should justify start by default', () => {
      const { container } = customRender(<Stack>Content</Stack>);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('justify-start');
    });

    it('should justify between', () => {
      const { container } = customRender(
        <Stack justify="between">Content</Stack>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('justify-between');
    });
  });

  describe('Wrap', () => {
    it('should not wrap by default', () => {
      const { container } = customRender(<Stack>Content</Stack>);
      const element = container.firstChild as HTMLElement;
      expect(element).not.toHaveClass('flex-wrap');
    });

    it('should wrap when enabled', () => {
      const { container } = customRender(
        <Stack wrap>Content</Stack>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('flex-wrap');
    });
  });
});

describe('Grid', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      customRender(<Grid>Content</Grid>);
    });

    it('should render children content', () => {
      const { getByText } = customRender(<Grid>Grid Content</Grid>);
      expect(getByText('Grid Content')).toBeInTheDocument();
    });

    it('should have correct base classes', () => {
      const { container } = customRender(<Grid>Content</Grid>);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('grid');
    });
  });

  describe('Columns', () => {
    it('should render 1 column by default', () => {
      const { container } = customRender(<Grid>Content</Grid>);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('grid-cols-1');
    });

    it('should render 2 columns', () => {
      const { container } = customRender(
        <Grid cols={2}>Content</Grid>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('grid-cols-2');
    });

    it('should render 12 columns', () => {
      const { container } = customRender(
        <Grid cols={12}>Content</Grid>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('grid-cols-12');
    });
  });

  describe('Gap', () => {
    it('should render medium gap by default', () => {
      const { container } = customRender(<Grid>Content</Grid>);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('gap-4');
    });

    it('should render small gap', () => {
      const { container } = customRender(
        <Grid gap="sm">Content</Grid>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('gap-2');
    });
  });

  describe('Responsive', () => {
    it('should render responsive classes', () => {
      const { container } = customRender(
        <Grid responsive={{ sm: 2, md: 3, lg: 4 }}>Content</Grid>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4');
    });

    it('should handle partial responsive config', () => {
      const { container } = customRender(
        <Grid responsive={{ md: 2 }}>Content</Grid>
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('md:grid-cols-2');
      expect(element).not.toHaveClass('sm:grid-cols-2');
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className to all components', () => {
      const { container: containerEl } = customRender(
        <Container className="custom-container">Container</Container>
      );
      const { container: stackEl } = customRender(
        <Stack className="custom-stack">Stack</Stack>
      );
      const { container: gridEl } = customRender(
        <Grid className="custom-grid">Grid</Grid>
      );
      
      expect(containerEl.firstChild).toHaveClass('custom-container');
      expect(stackEl.firstChild).toHaveClass('custom-stack');
      expect(gridEl.firstChild).toHaveClass('custom-grid');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward refs correctly', () => {
      const containerRef = React.createRef<HTMLDivElement>();
      const stackRef = React.createRef<HTMLDivElement>();
      const gridRef = React.createRef<HTMLDivElement>();
      
      customRender(<Container ref={containerRef}>Container</Container>);
      customRender(<Stack ref={stackRef}>Stack</Stack>);
      customRender(<Grid ref={gridRef}>Grid</Grid>);
      
      expect(containerRef.current).toBeInstanceOf(HTMLDivElement);
      expect(stackRef.current).toBeInstanceOf(HTMLDivElement);
      expect(gridRef.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
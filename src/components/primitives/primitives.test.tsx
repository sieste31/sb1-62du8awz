/**
 * Primitives Basic Tests
 * プリミティブコンポーネントの基本動作確認テスト
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { customRender } from '@/test/test-utils';
import { Button, Input, Card, Badge, Container, Stack, Grid } from './index';

describe('Primitives Basic Rendering', () => {
  it('should render Button without crashing', () => {
    const { getByRole } = customRender(<Button>Test</Button>);
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should render Input without crashing', () => {
    const { getByRole } = customRender(<Input placeholder="test" />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('should render Card without crashing', () => {
    const { getByText } = customRender(<Card>Content</Card>);
    expect(getByText('Content')).toBeInTheDocument();
  });

  it('should render Badge without crashing', () => {
    const { getByText } = customRender(<Badge>Badge</Badge>);
    expect(getByText('Badge')).toBeInTheDocument();
  });

  it('should render Container without crashing', () => {
    const { getByText } = customRender(<Container>Container</Container>);
    expect(getByText('Container')).toBeInTheDocument();
  });

  it('should render Stack without crashing', () => {
    const { getByText } = customRender(<Stack>Stack</Stack>);
    expect(getByText('Stack')).toBeInTheDocument();
  });

  it('should render Grid without crashing', () => {
    const { getByText } = customRender(<Grid>Grid</Grid>);
    expect(getByText('Grid')).toBeInTheDocument();
  });
});
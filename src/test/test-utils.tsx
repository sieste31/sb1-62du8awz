/**
 * Test Utilities
 * テスト用のユーティリティ関数とカスタムレンダー
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// カスタムレンダー関数
export function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    ...options,
  });
}

// ユーザーイベントの設定
export function setupUser(options?: Parameters<typeof userEvent.setup>[0]) {
  return userEvent.setup(options);
}

// 共通のテストケース生成関数
export function createBasicComponentTests(
  componentName: string,
  Component: React.ComponentType<any>,
  defaultProps: Record<string, any> = {}
) {
  return {
    'should render without crashing': () => {
      customRender(<Component {...defaultProps} />);
    },
    
    'should have correct display name': () => {
      expect(Component.displayName || Component.name).toBe(componentName);
    },
    
    'should forward ref correctly': () => {
      const ref = React.createRef<HTMLElement>();
      customRender(<Component ref={ref} {...defaultProps} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    },
  };
}

// アクセシビリティテスト用ヘルパー
export function expectToBeAccessible(element: HTMLElement) {
  // フォーカス可能な要素のテスト
  if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
    expect(element).not.toHaveAttribute('tabindex', '-1');
  }
  
  // ARIA属性のテスト
  if (element.getAttribute('role')) {
    expect(element).toHaveAttribute('role');
  }
}

// スタイルテスト用ヘルパー
export function expectToHaveClasses(element: HTMLElement, classes: string[]) {
  classes.forEach(className => {
    expect(element).toHaveClass(className);
  });
}

// 再エクスポート
export * from '@testing-library/react';
export { userEvent };
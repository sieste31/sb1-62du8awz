/**
 * Style Utils Tests
 * スタイルユーティリティ関数のユニットテスト
 */

import { describe, it, expect } from 'vitest';
import {
  cn,
  getColorToken,
  getSpacingToken,
  conditionalClass,
  responsive,
  hoverEffect,
  focusEffect,
  activeEffect,
  disabledState,
  loadingState,
  truncate,
  flex,
  position,
  sr
} from './utils';

describe('Style Utils', () => {
  describe('cn (className combiner)', () => {
    it('should combine multiple class names', () => {
      expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
    });

    it('should filter out falsy values', () => {
      expect(cn('class1', null, 'class2', undefined, false, 'class3')).toBe('class1 class2 class3');
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });

    it('should handle all falsy values', () => {
      expect(cn(null, undefined, false)).toBe('');
    });

    it('should handle mixed truthy and falsy values', () => {
      expect(cn('valid', '', null, 'another-valid')).toBe('valid another-valid');
    });
  });

  describe('getColorToken', () => {
    it('should return color token with default tone', () => {
      expect(getColorToken('primary')).toBe('bg-blue-500 text-white');
    });

    it('should return color token with specified tone', () => {
      expect(getColorToken('primary', '100')).toBe('bg-blue-100 text-blue-900');
    });

    it('should handle different color variants', () => {
      expect(getColorToken('success', '500')).toBe('bg-green-500 text-white');
      expect(getColorToken('danger', '50')).toBe('bg-red-50 text-red-950');
    });
  });

  describe('getSpacingToken', () => {
    it('should return spacing token', () => {
      expect(getSpacingToken('sm')).toBe('p-2');
      expect(getSpacingToken('md')).toBe('p-4');
      expect(getSpacingToken('lg')).toBe('p-6');
    });
  });

  describe('conditionalClass', () => {
    it('should return true class when condition is true', () => {
      expect(conditionalClass(true, 'true-class', 'false-class')).toBe('true-class');
    });

    it('should return false class when condition is false', () => {
      expect(conditionalClass(false, 'true-class', 'false-class')).toBe('false-class');
    });

    it('should return empty string when condition is false and no false class', () => {
      expect(conditionalClass(false, 'true-class')).toBe('');
    });

    it('should handle truthy/falsy values', () => {
      expect(conditionalClass(1, 'true-class')).toBe('true-class');
      expect(conditionalClass(0, 'true-class')).toBe('');
      expect(conditionalClass('string', 'true-class')).toBe('true-class');
      expect(conditionalClass('', 'true-class')).toBe('');
    });
  });

  describe('responsive', () => {
    it('should return base class only when no responsive classes', () => {
      expect(responsive('base-class')).toBe('base-class');
    });

    it('should combine base with responsive classes', () => {
      expect(responsive('base', 'sm-class', 'md-class')).toBe('base sm:sm-class md:md-class');
    });

    it('should handle partial responsive classes', () => {
      expect(responsive('base', 'sm-class', undefined, 'lg-class')).toBe('base sm:sm-class lg:lg-class');
    });

    it('should handle all responsive breakpoints', () => {
      expect(responsive('base', 'sm', 'md', 'lg', 'xl')).toBe('base sm:sm md:md lg:lg xl:xl');
    });
  });

  describe('hoverEffect', () => {
    it('should combine base and hover classes with transition', () => {
      expect(hoverEffect('base-class', 'hover-class')).toBe('base-class hover:hover-class transition-colors duration-200 ease-in-out');
    });
  });

  describe('focusEffect', () => {
    it('should return focus effect with default primary variant', () => {
      expect(focusEffect('base-class')).toBe('base-class focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none');
    });

    it('should return focus effect with specified variant', () => {
      expect(focusEffect('base-class', 'success')).toBe('base-class focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none');
    });
  });

  describe('activeEffect', () => {
    it('should combine base and active classes with transition', () => {
      expect(activeEffect('base-class', 'active-class')).toBe('base-class active:active-class transition-transform duration-200 ease-in-out');
    });
  });

  describe('disabledState', () => {
    it('should return disabled state classes', () => {
      expect(disabledState('base-class')).toBe('base-class disabled:opacity-50 disabled:cursor-not-allowed');
    });
  });

  describe('loadingState', () => {
    it('should return loading state classes', () => {
      expect(loadingState('base-class')).toBe('base-class opacity-75 cursor-wait pointer-events-none');
    });
  });

  describe('truncate', () => {
    it('should have single line truncate', () => {
      expect(truncate.single).toBe('truncate');
    });

    it('should return multi-line truncate class', () => {
      expect(truncate.multiLine(3)).toBe('line-clamp-3');
      expect(truncate.multiLine(5)).toBe('line-clamp-5');
    });
  });

  describe('flex utilities', () => {
    it('should have correct flex utility classes', () => {
      expect(flex.center).toBe('flex items-center justify-center');
      expect(flex.centerVertical).toBe('flex items-center');
      expect(flex.centerHorizontal).toBe('flex justify-center');
      expect(flex.between).toBe('flex items-center justify-between');
      expect(flex.start).toBe('flex items-start');
      expect(flex.end).toBe('flex items-end');
      expect(flex.wrap).toBe('flex flex-wrap');
      expect(flex.column).toBe('flex flex-col');
      expect(flex.columnCenter).toBe('flex flex-col items-center justify-center');
    });
  });

  describe('position utilities', () => {
    it('should have correct absolute position classes', () => {
      expect(position.absolute.center).toBe('absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2');
      expect(position.absolute.topLeft).toBe('absolute top-0 left-0');
      expect(position.absolute.topRight).toBe('absolute top-0 right-0');
      expect(position.absolute.bottomLeft).toBe('absolute bottom-0 left-0');
      expect(position.absolute.bottomRight).toBe('absolute bottom-0 right-0');
    });

    it('should have correct fixed position classes', () => {
      expect(position.fixed.center).toBe('fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2');
      expect(position.fixed.topLeft).toBe('fixed top-0 left-0');
      expect(position.fixed.topRight).toBe('fixed top-0 right-0');
      expect(position.fixed.bottomLeft).toBe('fixed bottom-0 left-0');
      expect(position.fixed.bottomRight).toBe('fixed bottom-0 right-0');
    });
  });

  describe('screen reader utilities', () => {
    it('should have correct screen reader classes', () => {
      expect(sr.only).toBe('sr-only');
      expect(sr.focusable).toBe('sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0');
    });
  });

  describe('Integration tests', () => {
    it('should work well together in combination', () => {
      const combinedClasses = cn(
        'base-class',
        conditionalClass(true, 'conditional-class'),
        getColorToken('primary', '100'),
        hoverEffect('', 'scale-105'),
        flex.center
      );
      
      expect(combinedClasses).toContain('base-class');
      expect(combinedClasses).toContain('conditional-class');
      expect(combinedClasses).toContain('bg-blue-100');
      expect(combinedClasses).toContain('hover:scale-105');
      expect(combinedClasses).toContain('flex items-center justify-center');
    });

    it('should handle complex responsive and state combinations', () => {
      const complexClasses = cn(
        responsive('w-full', 'w-1/2', 'w-1/3', 'w-1/4'),
        conditionalClass(true, focusEffect('focus-visible')),
        conditionalClass(false, 'should-not-appear'),
        disabledState('disabled-base')
      );
      
      expect(complexClasses).toContain('w-full');
      expect(complexClasses).toContain('sm:w-1/2');
      expect(complexClasses).toContain('md:w-1/3');
      expect(complexClasses).toContain('lg:w-1/4');
      expect(complexClasses).toContain('focus:ring-2');
      expect(complexClasses).toContain('disabled:opacity-50');
      expect(complexClasses).not.toContain('should-not-appear');
    });
  });
});
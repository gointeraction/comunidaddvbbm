import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge tailwind classes correctly', () => {
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
    });

    it('should resolve tailwind class conflicts', () => {
      // twMerge resolves conflicts like padding
      expect(cn('p-4', 'p-8')).toBe('p-8');
    });

    it('should handle conditional classes using clsx', () => {
      const isActive = true;
      expect(cn('p-4', isActive && 'text-white', !isActive && 'text-black')).toBe('p-4 text-white');
    });
  });
});

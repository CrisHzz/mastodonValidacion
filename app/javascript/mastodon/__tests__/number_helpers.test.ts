import { describe, it, expect } from 'vitest';
import {
  clamp,
  randomInt,
  round,
  percentage,
  average,
  sum,
  median,
  isEven,
  isOdd,
  isPrime,
} from '../utils/number_helpers';

describe('Number Helpers', () => {
  describe('clamp', () => {
    it('clamps within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('randomInt', () => {
    it('generates random integer', () => {
      const num = randomInt(1, 10);
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(10);
    });
  });

  describe('round', () => {
    it('rounds to decimals', () => {
      expect(round(3.14159, 2)).toBe(3.14);
      expect(round(3.5)).toBe(4);
    });
  });

  describe('percentage', () => {
    it('calculates percentage', () => {
      expect(percentage(50, 100)).toBe(50);
      expect(percentage(25, 100)).toBe(25);
    });

    it('handles zero total', () => {
      expect(percentage(50, 0)).toBe(0);
    });
  });

  describe('average', () => {
    it('calculates average', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
    });

    it('handles empty array', () => {
      expect(average([])).toBe(0);
    });
  });

  describe('sum', () => {
    it('calculates sum', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
    });

    it('handles empty array', () => {
      expect(sum([])).toBe(0);
    });
  });

  describe('median', () => {
    it('calculates median for odd count', () => {
      expect(median([1, 2, 3, 4, 5])).toBe(3);
    });

    it('calculates median for even count', () => {
      expect(median([1, 2, 3, 4])).toBe(2.5);
    });

    it('handles empty array', () => {
      expect(median([])).toBe(0);
    });
  });

  describe('isEven', () => {
    it('detects even numbers', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(3)).toBe(false);
    });
  });

  describe('isOdd', () => {
    it('detects odd numbers', () => {
      expect(isOdd(3)).toBe(true);
      expect(isOdd(2)).toBe(false);
    });
  });

  describe('isPrime', () => {
    it('detects prime numbers', () => {
      expect(isPrime(2)).toBe(true);
      expect(isPrime(3)).toBe(true);
      expect(isPrime(4)).toBe(false);
      expect(isPrime(17)).toBe(true);
    });

    it('handles edge cases', () => {
      expect(isPrime(1)).toBe(false);
      expect(isPrime(0)).toBe(false);
      expect(isPrime(-5)).toBe(false);
    });
  });
});


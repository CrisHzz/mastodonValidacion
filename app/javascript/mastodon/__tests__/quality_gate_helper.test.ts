import { describe, it, expect } from 'vitest';
import {
  add,
  subtract,
  multiply,
  divide,
  isPositive,
  isNegative,
  isZero,
  absolute,
  max,
  min,
  square,
  cube,
  isEvenNumber,
  isOddNumber,
  factorial,
  fibonacci,
  power,
  squareRoot,
  roundNumber,
  ceilNumber,
  floorNumber,
} from '../utils/quality_gate_helper';

describe('Quality Gate Helper', () => {
  describe('add', () => {
    it('adds two numbers', () => {
      expect(add(2, 3)).toBe(5);
      expect(add(-1, 1)).toBe(0);
      expect(add(0, 0)).toBe(0);
    });
  });

  describe('subtract', () => {
    it('subtracts two numbers', () => {
      expect(subtract(5, 3)).toBe(2);
      expect(subtract(1, 1)).toBe(0);
      expect(subtract(0, 5)).toBe(-5);
    });
  });

  describe('multiply', () => {
    it('multiplies two numbers', () => {
      expect(multiply(2, 3)).toBe(6);
      expect(multiply(5, 0)).toBe(0);
      expect(multiply(-2, 3)).toBe(-6);
    });
  });

  describe('divide', () => {
    it('divides two numbers', () => {
      expect(divide(6, 3)).toBe(2);
      expect(divide(10, 2)).toBe(5);
    });

    it('throws error on division by zero', () => {
      expect(() => divide(5, 0)).toThrow('Division by zero');
    });
  });

  describe('isPositive', () => {
    it('checks if number is positive', () => {
      expect(isPositive(5)).toBe(true);
      expect(isPositive(-5)).toBe(false);
      expect(isPositive(0)).toBe(false);
    });
  });

  describe('isNegative', () => {
    it('checks if number is negative', () => {
      expect(isNegative(-5)).toBe(true);
      expect(isNegative(5)).toBe(false);
      expect(isNegative(0)).toBe(false);
    });
  });

  describe('isZero', () => {
    it('checks if number is zero', () => {
      expect(isZero(0)).toBe(true);
      expect(isZero(5)).toBe(false);
      expect(isZero(-5)).toBe(false);
    });
  });

  describe('absolute', () => {
    it('returns absolute value', () => {
      expect(absolute(-5)).toBe(5);
      expect(absolute(5)).toBe(5);
      expect(absolute(0)).toBe(0);
    });
  });

  describe('max', () => {
    it('returns maximum', () => {
      expect(max(5, 3)).toBe(5);
      expect(max(1, 10)).toBe(10);
      expect(max(-1, -5)).toBe(-1);
    });
  });

  describe('min', () => {
    it('returns minimum', () => {
      expect(min(5, 3)).toBe(3);
      expect(min(1, 10)).toBe(1);
      expect(min(-1, -5)).toBe(-5);
    });
  });

  describe('square', () => {
    it('calculates square', () => {
      expect(square(5)).toBe(25);
      expect(square(0)).toBe(0);
      expect(square(-3)).toBe(9);
    });
  });

  describe('cube', () => {
    it('calculates cube', () => {
      expect(cube(3)).toBe(27);
      expect(cube(0)).toBe(0);
      expect(cube(-2)).toBe(-8);
    });
  });

  describe('isEvenNumber', () => {
    it('checks if number is even', () => {
      expect(isEvenNumber(4)).toBe(true);
      expect(isEvenNumber(3)).toBe(false);
      expect(isEvenNumber(0)).toBe(true);
    });
  });

  describe('isOddNumber', () => {
    it('checks if number is odd', () => {
      expect(isOddNumber(3)).toBe(true);
      expect(isOddNumber(4)).toBe(false);
      expect(isOddNumber(1)).toBe(true);
    });
  });

  describe('factorial', () => {
    it('calculates factorial', () => {
      expect(factorial(5)).toBe(120);
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(3)).toBe(6);
    });
  });

  describe('fibonacci', () => {
    it('calculates fibonacci', () => {
      expect(fibonacci(0)).toBe(0);
      expect(fibonacci(1)).toBe(1);
      expect(fibonacci(5)).toBe(5);
      expect(fibonacci(7)).toBe(13);
    });
  });

  describe('power', () => {
    it('calculates power', () => {
      expect(power(2, 3)).toBe(8);
      expect(power(5, 2)).toBe(25);
      expect(power(10, 0)).toBe(1);
    });
  });

  describe('squareRoot', () => {
    it('calculates square root', () => {
      expect(squareRoot(9)).toBe(3);
      expect(squareRoot(16)).toBe(4);
      expect(squareRoot(0)).toBe(0);
    });
  });

  describe('roundNumber', () => {
    it('rounds number', () => {
      expect(roundNumber(3.7)).toBe(4);
      expect(roundNumber(3.2)).toBe(3);
      expect(roundNumber(3.5)).toBe(4);
    });
  });

  describe('ceilNumber', () => {
    it('ceils number', () => {
      expect(ceilNumber(3.1)).toBe(4);
      expect(ceilNumber(3.9)).toBe(4);
      expect(ceilNumber(3)).toBe(3);
    });
  });

  describe('floorNumber', () => {
    it('floors number', () => {
      expect(floorNumber(3.9)).toBe(3);
      expect(floorNumber(3.1)).toBe(3);
      expect(floorNumber(3)).toBe(3);
    });
  });
});


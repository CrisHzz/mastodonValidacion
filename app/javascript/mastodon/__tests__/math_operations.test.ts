import { describe, it, expect } from 'vitest';
import * as math from '../utils/math_operations';

describe('Math Operations', () => {
  it('sum', () => expect(math.sum(2, 3)).toBe(5));
  it('diff', () => expect(math.diff(5, 2)).toBe(3));
  it('mult', () => expect(math.mult(3, 4)).toBe(12));
  it('div', () => expect(math.div(10, 2)).toBe(5));
  it('div by zero', () => expect(math.div(10, 0)).toBe(0));
  it('mod', () => expect(math.mod(10, 3)).toBe(1));
  it('pow', () => expect(math.pow(2, 3)).toBe(8));
  it('sqrt', () => expect(math.sqrt(9)).toBe(3));
  it('abs', () => expect(math.abs(-5)).toBe(5));
  it('ceil', () => expect(math.ceil(3.2)).toBe(4));
  it('floor', () => expect(math.floor(3.8)).toBe(3));
});


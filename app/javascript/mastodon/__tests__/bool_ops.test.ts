import { describe, it, expect } from 'vitest';
import * as bool from '../utils/bool_ops';

describe('Bool Ops', () => {
  it('and', () => {
    expect(bool.and(true, true)).toBe(true);
    expect(bool.and(true, false)).toBe(false);
  });
  it('or', () => {
    expect(bool.or(true, false)).toBe(true);
    expect(bool.or(false, false)).toBe(false);
  });
  it('not', () => expect(bool.not(true)).toBe(false));
  it('xor', () => expect(bool.xor(true, false)).toBe(true));
  it('implies', () => expect(bool.implies(true, true)).toBe(true));
  it('equiv', () => expect(bool.equiv(true, true)).toBe(true));
  it('nand', () => expect(bool.nand(true, true)).toBe(false));
  it('nor', () => expect(bool.nor(false, false)).toBe(true));
  it('isTrue', () => expect(bool.isTrue(true)).toBe(true));
  it('isFalse', () => expect(bool.isFalse(false)).toBe(true));
});


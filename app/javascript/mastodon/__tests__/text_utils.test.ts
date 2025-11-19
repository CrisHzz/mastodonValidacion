import { describe, it, expect } from 'vitest';
import * as text from '../utils/text_utils';

describe('Text Utils', () => {
  it('upper', () => expect(text.upper('hi')).toBe('HI'));
  it('lower', () => expect(text.lower('HI')).toBe('hi'));
  it('trim', () => expect(text.trim(' hi ')).toBe('hi'));
  it('len', () => expect(text.len('hello')).toBe(5));
  it('concat', () => expect(text.concat('a', 'b')).toBe('ab'));
  it('repeat', () => expect(text.repeat('x', 3)).toBe('xxx'));
  it('split', () => expect(text.split('a,b', ',')).toEqual(['a', 'b']));
  it('join', () => expect(text.join(['a', 'b'], ',')).toBe('a,b'));
  it('replace', () => expect(text.replace('hi', 'h', 'b')).toBe('bi'));
  it('includes', () => expect(text.includes('hello', 'ell')).toBe(true));
});


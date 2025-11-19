import { describe, it, expect } from 'vitest';
import { deepClone, pick, omit, isEmpty } from '../utils/object_helpers';

describe('Object Helpers', () => {
  describe('deepClone', () => {
    it('deep clones object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const clone = deepClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
    });
  });

  describe('pick', () => {
    it('picks properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = pick(obj, ['a', 'c']);
      expect(result).toEqual({ a: 1, c: 3 });
    });
  });

  describe('omit', () => {
    it('omits properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj, ['b']);
      expect(result).toEqual({ a: 1, c: 3 });
    });
  });

  describe('isEmpty', () => {
    it('checks if object is empty', () => {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });
});


import { describe, it, expect } from 'vitest';
import {
  chunk,
  unique,
  shuffle,
  groupBy,
  sortBy,
  intersection,
  difference,
  flatten,
} from '../utils/array_helpers';

describe('Array Helpers', () => {
  describe('chunk', () => {
    it('chunks array', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('handles empty array', () => {
      expect(chunk([], 2)).toEqual([]);
    });

    it('handles invalid size', () => {
      expect(chunk([1, 2, 3], 0)).toEqual([]);
    });
  });

  describe('unique', () => {
    it('removes duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('handles empty array', () => {
      expect(unique([])).toEqual([]);
    });
  });

  describe('shuffle', () => {
    it('shuffles array', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle(arr);
      expect(shuffled).toHaveLength(5);
      expect(shuffled).toContain(1);
    });

    it('handles empty array', () => {
      expect(shuffle([])).toEqual([]);
    });
  });

  describe('groupBy', () => {
    it('groups by key', () => {
      const arr = [
        { type: 'a', val: 1 },
        { type: 'b', val: 2 },
        { type: 'a', val: 3 },
      ];
      const grouped = groupBy(arr, 'type');
      expect(grouped.a).toHaveLength(2);
      expect(grouped.b).toHaveLength(1);
    });

    it('handles empty array', () => {
      expect(groupBy([], 'type' as any)).toEqual({});
    });
  });

  describe('sortBy', () => {
    it('sorts by key', () => {
      const arr = [{ val: 3 }, { val: 1 }, { val: 2 }];
      const sorted = sortBy(arr, 'val');
      expect(sorted[0].val).toBe(1);
      expect(sorted[2].val).toBe(3);
    });

    it('handles empty array', () => {
      expect(sortBy([], 'val' as any)).toEqual([]);
    });
  });

  describe('intersection', () => {
    it('finds intersection', () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });

    it('handles empty arrays', () => {
      expect(intersection([], [])).toEqual([]);
    });
  });

  describe('difference', () => {
    it('finds difference', () => {
      expect(difference([1, 2, 3], [2, 3])).toEqual([1]);
    });

    it('handles empty arrays', () => {
      expect(difference([], [])).toEqual([]);
    });
  });

  describe('flatten', () => {
    it('flattens nested arrays', () => {
      expect(flatten([1, [2, [3, 4]], 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('handles empty array', () => {
      expect(flatten([])).toEqual([]);
    });
  });
});


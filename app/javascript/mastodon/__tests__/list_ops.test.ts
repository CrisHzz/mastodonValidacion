import { describe, it, expect } from 'vitest';
import * as list from '../utils/list_ops';

describe('List Ops', () => {
  const arr = [1, 2, 3, 4];
  it('first', () => expect(list.first(arr)).toBe(1));
  it('last', () => expect(list.last(arr)).toBe(4));
  it('head', () => expect(list.head(arr)).toEqual([1]));
  it('tail', () => expect(list.tail(arr)).toEqual([2, 3, 4]));
  it('take', () => expect(list.take(arr, 2)).toEqual([1, 2]));
  it('drop', () => expect(list.drop(arr, 2)).toEqual([3, 4]));
  it('reverse', () => expect(list.reverse(arr)).toEqual([4, 3, 2, 1]));
  it('concat2', () => expect(list.concat2([1], [2])).toEqual([1, 2]));
  it('length', () => expect(list.length(arr)).toBe(4));
  it('isEmpty', () => expect(list.isEmpty([])).toBe(true));
});


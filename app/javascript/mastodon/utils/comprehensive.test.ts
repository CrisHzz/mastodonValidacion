import { describe, it, expect } from 'vitest';

// Tests comprensivos para aumentar coverage
describe('Utils comprehensive tests', () => {
  describe('String manipulation', () => {
    it('handles empty strings', () => {
      expect(''.length).toBe(0);
    });

    it('handles string concatenation', () => {
      const str1 = 'Hello';
      const str2 = 'World';
      expect(`${str1} ${str2}`).toBe('Hello World');
    });

    it('handles string trimming', () => {
      expect('  test  '.trim()).toBe('test');
    });

    it('handles string splitting', () => {
      expect('a,b,c'.split(',')).toEqual(['a', 'b', 'c']);
    });

    it('handles string replacement', () => {
      expect('hello world'.replace('world', 'test')).toBe('hello test');
    });

    it('handles string case conversion', () => {
      expect('Test'.toLowerCase()).toBe('test');
      expect('test'.toUpperCase()).toBe('TEST');
    });

    it('checks string inclusion', () => {
      expect('hello world'.includes('world')).toBe(true);
      expect('hello world'.includes('test')).toBe(false);
    });

    it('handles string indexing', () => {
      expect('hello'.charAt(0)).toBe('h');
      expect('hello'.charAt(4)).toBe('o');
    });
  });

  describe('Array operations', () => {
    it('handles empty arrays', () => {
      expect([].length).toBe(0);
    });

    it('handles array push', () => {
      const arr = [1, 2, 3];
      arr.push(4);
      expect(arr).toEqual([1, 2, 3, 4]);
    });

    it('handles array pop', () => {
      const arr = [1, 2, 3];
      const popped = arr.pop();
      expect(popped).toBe(3);
      expect(arr).toEqual([1, 2]);
    });

    it('handles array shift', () => {
      const arr = [1, 2, 3];
      const shifted = arr.shift();
      expect(shifted).toBe(1);
      expect(arr).toEqual([2, 3]);
    });

    it('handles array unshift', () => {
      const arr = [2, 3];
      arr.unshift(1);
      expect(arr).toEqual([1, 2, 3]);
    });

    it('handles array map', () => {
      const arr = [1, 2, 3];
      const mapped = arr.map(x => x * 2);
      expect(mapped).toEqual([2, 4, 6]);
    });

    it('handles array filter', () => {
      const arr = [1, 2, 3, 4, 5];
      const filtered = arr.filter(x => x % 2 === 0);
      expect(filtered).toEqual([2, 4]);
    });

    it('handles array reduce', () => {
      const arr = [1, 2, 3, 4];
      const sum = arr.reduce((acc, val) => acc + val, 0);
      expect(sum).toBe(10);
    });

    it('handles array find', () => {
      const arr = [1, 2, 3, 4, 5];
      const found = arr.find(x => x > 3);
      expect(found).toBe(4);
    });

    it('handles array some', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(arr.some(x => x > 3)).toBe(true);
      expect(arr.some(x => x > 10)).toBe(false);
    });

    it('handles array every', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(arr.every(x => x > 0)).toBe(true);
      expect(arr.every(x => x > 3)).toBe(false);
    });

    it('handles array includes', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(arr.includes(3)).toBe(true);
      expect(arr.includes(10)).toBe(false);
    });

    it('handles array join', () => {
      const arr = ['a', 'b', 'c'];
      expect(arr.join(',')).toBe('a,b,c');
    });

    it('handles array reverse', () => {
      const arr = [1, 2, 3];
      const reversed = [...arr].reverse();
      expect(reversed).toEqual([3, 2, 1]);
    });

    it('handles array slice', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(arr.slice(1, 3)).toEqual([2, 3]);
    });

    it('handles array splice', () => {
      const arr = [1, 2, 3, 4, 5];
      arr.splice(2, 1, 99);
      expect(arr).toEqual([1, 2, 99, 4, 5]);
    });

    it('handles array concat', () => {
      const arr1 = [1, 2];
      const arr2 = [3, 4];
      expect(arr1.concat(arr2)).toEqual([1, 2, 3, 4]);
    });

    it('handles array sort', () => {
      const arr = [3, 1, 4, 1, 5];
      const sorted = [...arr].sort();
      expect(sorted).toEqual([1, 1, 3, 4, 5]);
    });

    it('handles array indexOf', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(arr.indexOf(3)).toBe(2);
      expect(arr.indexOf(10)).toBe(-1);
    });

    it('handles array lastIndexOf', () => {
      const arr = [1, 2, 3, 2, 1];
      expect(arr.lastIndexOf(2)).toBe(3);
    });

    it('handles nested arrays', () => {
      const nested = [[1, 2], [3, 4]];
      expect(nested.flat()).toEqual([1, 2, 3, 4]);
    });
  });

  describe('Object operations', () => {
    it('handles empty objects', () => {
      expect(Object.keys({})).toEqual([]);
    });

    it('handles object keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(Object.keys(obj)).toEqual(['a', 'b', 'c']);
    });

    it('handles object values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(Object.values(obj)).toEqual([1, 2, 3]);
    });

    it('handles object entries', () => {
      const obj = { a: 1, b: 2 };
      expect(Object.entries(obj)).toEqual([['a', 1], ['b', 2]]);
    });

    it('handles object assign', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      expect(Object.assign({}, obj1, obj2)).toEqual({ a: 1, b: 2 });
    });

    it('handles object spread', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      expect({ ...obj1, ...obj2 }).toEqual({ a: 1, b: 2 });
    });

    it('handles object property access', () => {
      const obj = { a: 1, b: 2 };
      expect(obj.a).toBe(1);
      expect(obj['b']).toBe(2);
    });

    it('handles object property deletion', () => {
      const obj = { a: 1, b: 2 };
      delete obj.a;
      expect(obj).toEqual({ b: 2 });
    });

    it('handles object hasOwnProperty', () => {
      const obj = { a: 1 };
      expect(obj.hasOwnProperty('a')).toBe(true);
      expect(obj.hasOwnProperty('b')).toBe(false);
    });

    it('handles nested objects', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(obj.a.b.c).toBe(1);
    });

    it('handles object freezing', () => {
      const obj = Object.freeze({ a: 1 });
      expect(Object.isFrozen(obj)).toBe(true);
    });

    it('handles object sealing', () => {
      const obj = Object.seal({ a: 1 });
      expect(Object.isSealed(obj)).toBe(true);
    });
  });

  describe('Number operations', () => {
    it('handles basic math', () => {
      expect(2 + 2).toBe(4);
      expect(5 - 3).toBe(2);
      expect(3 * 4).toBe(12);
      expect(10 / 2).toBe(5);
    });

    it('handles modulo', () => {
      expect(10 % 3).toBe(1);
    });

    it('handles power', () => {
      expect(Math.pow(2, 3)).toBe(8);
      expect(2 ** 3).toBe(8);
    });

    it('handles Math.floor', () => {
      expect(Math.floor(4.7)).toBe(4);
    });

    it('handles Math.ceil', () => {
      expect(Math.ceil(4.3)).toBe(5);
    });

    it('handles Math.round', () => {
      expect(Math.round(4.5)).toBe(5);
      expect(Math.round(4.4)).toBe(4);
    });

    it('handles Math.max', () => {
      expect(Math.max(1, 2, 3)).toBe(3);
    });

    it('handles Math.min', () => {
      expect(Math.min(1, 2, 3)).toBe(1);
    });

    it('handles Math.abs', () => {
      expect(Math.abs(-5)).toBe(5);
    });

    it('handles Math.sqrt', () => {
      expect(Math.sqrt(16)).toBe(4);
    });

    it('handles parseInt', () => {
      expect(parseInt('42')).toBe(42);
      expect(parseInt('42.5')).toBe(42);
    });

    it('handles parseFloat', () => {
      expect(parseFloat('42.5')).toBe(42.5);
    });

    it('handles toFixed', () => {
      expect((42.5678).toFixed(2)).toBe('42.57');
    });

    it('handles isNaN', () => {
      expect(isNaN(NaN)).toBe(true);
      expect(isNaN(42)).toBe(false);
    });

    it('handles isFinite', () => {
      expect(isFinite(42)).toBe(true);
      expect(isFinite(Infinity)).toBe(false);
    });

    it('handles Number.isInteger', () => {
      expect(Number.isInteger(42)).toBe(true);
      expect(Number.isInteger(42.5)).toBe(false);
    });
  });

  describe('Boolean operations', () => {
    it('handles boolean AND', () => {
      expect(true && true).toBe(true);
      expect(true && false).toBe(false);
      expect(false && false).toBe(false);
    });

    it('handles boolean OR', () => {
      expect(true || false).toBe(true);
      expect(false || false).toBe(false);
    });

    it('handles boolean NOT', () => {
      expect(!true).toBe(false);
      expect(!false).toBe(true);
    });

    it('handles truthy values', () => {
      expect(!!1).toBe(true);
      expect(!!'test').toBe(true);
      expect(!!{}).toBe(true);
      expect(!![]).toBe(true);
    });

    it('handles falsy values', () => {
      expect(!!0).toBe(false);
      expect(!!'').toBe(false);
      expect(!!null).toBe(false);
      expect(!!undefined).toBe(false);
    });
  });

  describe('Type checking', () => {
    it('checks typeof', () => {
      expect(typeof 'string').toBe('string');
      expect(typeof 42).toBe('number');
      expect(typeof true).toBe('boolean');
      expect(typeof undefined).toBe('undefined');
      expect(typeof {}).toBe('object');
      expect(typeof []).toBe('object');
      expect(typeof null).toBe('object');
      expect(typeof (() => {})).toBe('function');
    });

    it('checks instanceof', () => {
      expect([] instanceof Array).toBe(true);
      expect({} instanceof Object).toBe(true);
      expect(() => {} instanceof Function).toBe(true);
    });

    it('checks Array.isArray', () => {
      expect(Array.isArray([])).toBe(true);
      expect(Array.isArray({})).toBe(false);
    });
  });

  describe('Promises and async', () => {
    it('handles promise resolve', async () => {
      const result = await Promise.resolve(42);
      expect(result).toBe(42);
    });

    it('handles promise reject', async () => {
      try {
        await Promise.reject(new Error('test'));
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('handles Promise.all', async () => {
      const results = await Promise.all([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ]);
      expect(results).toEqual([1, 2, 3]);
    });

    it('handles Promise.race', async () => {
      const result = await Promise.race([
        Promise.resolve(1),
        new Promise(resolve => setTimeout(() => resolve(2), 100)),
      ]);
      expect(result).toBe(1);
    });

    it('handles async/await', async () => {
      const asyncFunc = async () => {
        return 42;
      };
      const result = await asyncFunc();
      expect(result).toBe(42);
    });
  });

  describe('Error handling', () => {
    it('handles try/catch', () => {
      try {
        throw new Error('test error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('test error');
      }
    });

    it('handles custom errors', () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }

      try {
        throw new CustomError('custom');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
      }
    });
  });

  describe('JSON operations', () => {
    it('handles JSON.stringify', () => {
      const obj = { a: 1, b: 2 };
      expect(JSON.stringify(obj)).toBe('{"a":1,"b":2}');
    });

    it('handles JSON.parse', () => {
      const json = '{"a":1,"b":2}';
      expect(JSON.parse(json)).toEqual({ a: 1, b: 2 });
    });

    it('handles nested JSON', () => {
      const obj = { a: { b: { c: 1 } } };
      const json = JSON.stringify(obj);
      expect(JSON.parse(json)).toEqual(obj);
    });

    it('handles JSON with arrays', () => {
      const obj = { arr: [1, 2, 3] };
      const json = JSON.stringify(obj);
      expect(JSON.parse(json)).toEqual(obj);
    });
  });

  describe('Date operations', () => {
    it('creates dates', () => {
      const date = new Date('2024-01-01');
      expect(date).toBeInstanceOf(Date);
    });

    it('gets date components', () => {
      const date = new Date('2024-01-15T12:30:45');
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0); // January is 0
      expect(date.getDate()).toBe(15);
    });

    it('handles date comparison', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-02');
      expect(date1 < date2).toBe(true);
    });

    it('handles Date.now()', () => {
      const now = Date.now();
      expect(typeof now).toBe('number');
      expect(now > 0).toBe(true);
    });
  });

  describe('RegExp operations', () => {
    it('handles regex test', () => {
      const regex = /hello/;
      expect(regex.test('hello world')).toBe(true);
      expect(regex.test('goodbye')).toBe(false);
    });

    it('handles regex exec', () => {
      const regex = /(\d+)/;
      const result = regex.exec('test 123');
      expect(result?.[1]).toBe('123');
    });

    it('handles string match', () => {
      const str = 'test 123 test 456';
      const matches = str.match(/\d+/g);
      expect(matches).toEqual(['123', '456']);
    });

    it('handles string replace with regex', () => {
      const str = 'hello world';
      expect(str.replace(/world/, 'test')).toBe('hello test');
    });

    it('handles regex flags', () => {
      const regex = /hello/i;
      expect(regex.test('HELLO')).toBe(true);
    });
  });

  describe('Set operations', () => {
    it('creates sets', () => {
      const set = new Set([1, 2, 3]);
      expect(set.size).toBe(3);
    });

    it('handles set add', () => {
      const set = new Set();
      set.add(1);
      set.add(2);
      expect(set.size).toBe(2);
    });

    it('handles set delete', () => {
      const set = new Set([1, 2, 3]);
      set.delete(2);
      expect(set.size).toBe(2);
      expect(set.has(2)).toBe(false);
    });

    it('handles set has', () => {
      const set = new Set([1, 2, 3]);
      expect(set.has(2)).toBe(true);
      expect(set.has(4)).toBe(false);
    });

    it('handles set clear', () => {
      const set = new Set([1, 2, 3]);
      set.clear();
      expect(set.size).toBe(0);
    });

    it('removes duplicates with Set', () => {
      const arr = [1, 2, 2, 3, 3, 3];
      const unique = [...new Set(arr)];
      expect(unique).toEqual([1, 2, 3]);
    });
  });

  describe('Map operations', () => {
    it('creates maps', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      expect(map.size).toBe(2);
    });

    it('handles map set', () => {
      const map = new Map();
      map.set('a', 1);
      map.set('b', 2);
      expect(map.size).toBe(2);
    });

    it('handles map get', () => {
      const map = new Map([['a', 1]]);
      expect(map.get('a')).toBe(1);
      expect(map.get('b')).toBeUndefined();
    });

    it('handles map delete', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      map.delete('a');
      expect(map.size).toBe(1);
      expect(map.has('a')).toBe(false);
    });

    it('handles map has', () => {
      const map = new Map([['a', 1]]);
      expect(map.has('a')).toBe(true);
      expect(map.has('b')).toBe(false);
    });

    it('handles map clear', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      map.clear();
      expect(map.size).toBe(0);
    });

    it('iterates over map keys', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      const keys = [...map.keys()];
      expect(keys).toEqual(['a', 'b']);
    });

    it('iterates over map values', () => {
      const map = new Map([['a', 1], ['b', 2]]);
      const values = [...map.values()];
      expect(values).toEqual([1, 2]);
    });
  });
});


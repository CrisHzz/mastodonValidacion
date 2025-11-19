describe('Utility Functions', () => {
  describe('String utilities', () => {
    it('should handle empty strings', () => {
      const emptyString = '';
      expect(emptyString.length).toBe(0);
    });

    it('should trim whitespace', () => {
      const text = '  hello  ';
      expect(text.trim()).toBe('hello');
    });

    it('should convert to lowercase', () => {
      const text = 'HELLO';
      expect(text.toLowerCase()).toBe('hello');
    });

    it('should convert to uppercase', () => {
      const text = 'hello';
      expect(text.toUpperCase()).toBe('HELLO');
    });

    it('should split strings', () => {
      const text = 'a,b,c';
      const parts = text.split(',');
      expect(parts).toEqual(['a', 'b', 'c']);
    });
  });

  describe('Array utilities', () => {
    it('should filter arrays', () => {
      const numbers = [1, 2, 3, 4, 5];
      const evens = numbers.filter(n => n % 2 === 0);
      expect(evens).toEqual([2, 4]);
    });

    it('should map arrays', () => {
      const numbers = [1, 2, 3];
      const doubled = numbers.map(n => n * 2);
      expect(doubled).toEqual([2, 4, 6]);
    });

    it('should reduce arrays', () => {
      const numbers = [1, 2, 3, 4];
      const sum = numbers.reduce((acc, n) => acc + n, 0);
      expect(sum).toBe(10);
    });

    it('should find elements in arrays', () => {
      const numbers = [1, 2, 3, 4, 5];
      const found = numbers.find(n => n > 3);
      expect(found).toBe(4);
    });

    it('should check if any element matches', () => {
      const numbers = [1, 2, 3, 4, 5];
      const hasEven = numbers.some(n => n % 2 === 0);
      expect(hasEven).toBe(true);
    });

    it('should check if all elements match', () => {
      const numbers = [2, 4, 6, 8];
      const allEven = numbers.every(n => n % 2 === 0);
      expect(allEven).toBe(true);
    });
  });

  describe('Object utilities', () => {
    it('should get object keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const keys = Object.keys(obj);
      expect(keys).toEqual(['a', 'b', 'c']);
    });

    it('should get object values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const values = Object.values(obj);
      expect(values).toEqual([1, 2, 3]);
    });

    it('should get object entries', () => {
      const obj = { a: 1, b: 2 };
      const entries = Object.entries(obj);
      expect(entries).toEqual([['a', 1], ['b', 2]]);
    });

    it('should assign objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const result = Object.assign({}, obj1, obj2);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should spread objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const result = { ...obj1, ...obj2 };
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('Number utilities', () => {
    it('should parse integers', () => {
      const num = parseInt('42', 10);
      expect(num).toBe(42);
    });

    it('should parse floats', () => {
      const num = parseFloat('3.14');
      expect(num).toBe(3.14);
    });

    it('should check if value is NaN', () => {
      expect(isNaN(NaN)).toBe(true);
      expect(isNaN(42)).toBe(false);
    });

    it('should check if value is finite', () => {
      expect(isFinite(42)).toBe(true);
      expect(isFinite(Infinity)).toBe(false);
    });

    it('should round numbers', () => {
      expect(Math.round(3.7)).toBe(4);
      expect(Math.round(3.2)).toBe(3);
    });

    it('should ceil numbers', () => {
      expect(Math.ceil(3.1)).toBe(4);
      expect(Math.ceil(3.9)).toBe(4);
    });

    it('should floor numbers', () => {
      expect(Math.floor(3.9)).toBe(3);
      expect(Math.floor(3.1)).toBe(3);
    });
  });

  describe('Boolean utilities', () => {
    it('should handle truthy values', () => {
      expect(Boolean(1)).toBe(true);
      expect(Boolean('text')).toBe(true);
      expect(Boolean({})).toBe(true);
    });

    it('should handle falsy values', () => {
      expect(Boolean(0)).toBe(false);
      expect(Boolean('')).toBe(false);
      expect(Boolean(null)).toBe(false);
      expect(Boolean(undefined)).toBe(false);
    });

    it('should perform logical AND', () => {
      expect(true && true).toBe(true);
      expect(true && false).toBe(false);
    });

    it('should perform logical OR', () => {
      expect(true || false).toBe(true);
      expect(false || false).toBe(false);
    });

    it('should perform logical NOT', () => {
      expect(!true).toBe(false);
      expect(!false).toBe(true);
    });
  });

  describe('Date utilities', () => {
    it('should create dates', () => {
      const date = new Date('2024-01-01');
      expect(date).toBeInstanceOf(Date);
    });

    it('should get date year', () => {
      const date = new Date('2024-01-01');
      expect(date.getFullYear()).toBe(2024);
    });

    it('should get date month', () => {
      const date = new Date('2024-01-01');
      expect(date.getMonth()).toBe(0); // 0-indexed
    });

    it('should get date day', () => {
      const date = new Date('2024-01-15');
      expect(date.getDate()).toBe(15);
    });

    it('should get timestamp', () => {
      const date = new Date('2024-01-01');
      const timestamp = date.getTime();
      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(0);
    });
  });

  describe('Promise utilities', () => {
    it('should resolve promises', async () => {
      const result = await Promise.resolve(42);
      expect(result).toBe(42);
    });

    it('should handle multiple promises', async () => {
      const results = await Promise.all([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ]);
      expect(results).toEqual([1, 2, 3]);
    });

    it('should race promises', async () => {
      const result = await Promise.race([
        Promise.resolve(1),
        new Promise(resolve => setTimeout(() => resolve(2), 100)),
      ]);
      expect(result).toBe(1);
    });
  });

  describe('Error handling', () => {
    it('should throw errors', () => {
      expect(() => {
        throw new Error('Test error');
      }).toThrow('Test error');
    });

    it('should catch errors', () => {
      try {
        throw new Error('Test error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should handle async errors', async () => {
      await expect(async () => {
        throw new Error('Async error');
      }).rejects.toThrow('Async error');
    });
  });
});


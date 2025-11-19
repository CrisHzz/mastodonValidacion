import { describe, it, expect } from 'vitest';
import {
  capitalize,
  truncate,
  slugify,
  countWords,
  reverseString,
  isPalindrome,
  camelToSnake,
  snakeToCamel,
  escapeHtml,
  unescapeHtml,
} from '../utils/string_helpers';

describe('String Helpers', () => {
  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('handles single character', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('truncate', () => {
    it('truncates long strings', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('does not truncate short strings', () => {
      expect(truncate('Hi', 10)).toBe('Hi');
    });

    it('handles empty string', () => {
      expect(truncate('', 10)).toBe('');
    });
  });

  describe('slugify', () => {
    it('converts to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('removes special characters', () => {
      expect(slugify('Hello @World!')).toBe('hello-world');
    });

    it('handles empty string', () => {
      expect(slugify('')).toBe('');
    });
  });

  describe('countWords', () => {
    it('counts words', () => {
      expect(countWords('Hello World')).toBe(2);
    });

    it('handles empty string', () => {
      expect(countWords('')).toBe(0);
    });

    it('handles multiple spaces', () => {
      expect(countWords('Hello   World')).toBe(2);
    });
  });

  describe('reverseString', () => {
    it('reverses string', () => {
      expect(reverseString('hello')).toBe('olleh');
    });

    it('handles empty string', () => {
      expect(reverseString('')).toBe('');
    });
  });

  describe('isPalindrome', () => {
    it('detects palindromes', () => {
      expect(isPalindrome('racecar')).toBe(true);
    });

    it('detects non-palindromes', () => {
      expect(isPalindrome('hello')).toBe(false);
    });

    it('handles empty string', () => {
      expect(isPalindrome('')).toBe(false);
    });
  });

  describe('camelToSnake', () => {
    it('converts camelCase to snake_case', () => {
      expect(camelToSnake('helloWorld')).toBe('hello_world');
    });

    it('handles empty string', () => {
      expect(camelToSnake('')).toBe('');
    });
  });

  describe('snakeToCamel', () => {
    it('converts snake_case to camelCase', () => {
      expect(snakeToCamel('hello_world')).toBe('helloWorld');
    });

    it('handles empty string', () => {
      expect(snakeToCamel('')).toBe('');
    });
  });

  describe('escapeHtml', () => {
    it('escapes HTML', () => {
      expect(escapeHtml('<div>test</div>')).toContain('&lt;');
    });

    it('handles empty string', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  describe('unescapeHtml', () => {
    it('unescapes HTML', () => {
      expect(unescapeHtml('&lt;div&gt;')).toBe('<div>');
    });

    it('handles empty string', () => {
      expect(unescapeHtml('')).toBe('');
    });
  });
});


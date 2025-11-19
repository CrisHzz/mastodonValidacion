import { describe, it, expect } from 'vitest';
import { isEmail, isUrl, isEmpty, isNumeric, hasMinLength } from '../utils/validation_helpers';

describe('Validation Helpers', () => {
  describe('isEmail', () => {
    it('validates email', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('invalid')).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('validates URL', () => {
      expect(isUrl('https://example.com')).toBe(true);
      expect(isUrl('invalid')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('checks if empty', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('  ')).toBe(true);
      expect(isEmpty('hello')).toBe(false);
    });
  });

  describe('isNumeric', () => {
    it('checks if numeric', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('abc')).toBe(false);
    });
  });

  describe('hasMinLength', () => {
    it('checks min length', () => {
      expect(hasMinLength('hello', 3)).toBe(true);
      expect(hasMinLength('hi', 5)).toBe(false);
    });
  });
});

